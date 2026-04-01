/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable default-case */
const jwt = require('jsonwebtoken');
const { userAction, crapAction } = require('data-wolf');
const { createErrorResponse } = require('./api-response-handler');

function skippingRoutes() {
	const SKIP_ROUTES = [
		'/send-otp',
		'/register',
		'/register-crap-user',
		'/validate-otp',
		'/logout',
		// "/api/admin/auth/send-otp",
		// "/api/admin/auth/validate-otp",
		'/degrees',
		'/get-states',
		// "/api/region/get-countries",
		'/get-visible-countries',
		'/list-institutions',
		'/institution-types',
		'/list-institutions',
	];
	return SKIP_ROUTES;
}

const STATUS = {
	pending: 'Your profile is pending for approval, please wait for sometime',
	rejected:
		'Your profile is rejected, please contact support for further details',
	deleted:
		'Your profile is deleted, please contact support for further details',
};

// eslint-disable-next-line consistent-return
function statusBasedResponse(status) {
	if (STATUS[status]) {
		throw createErrorResponse('BAD_REQUEST', {
			message: STATUS[status],
			statusCode: 400,
		});
	}
	return null;
}

module.exports = {
	generateJWT(payload, expiresIn = '24h') {
		return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
	},

	authenticateJWT(req, res, next) {
		console.log(`Request Path inside authenticateJWT: ${req.path}`);
		if (
			skippingRoutes().filter((route) => req.path.includes(route))
				.length > 0
		) {
			return next();
		}
		let tokenDetails = {};
		if (req.path.includes('renew-access-token')) {
			tokenDetails = { token: req.body.refreshToken, type: 'refresh' };
			if (!tokenDetails.token) {
				return res.status(401).json({
					message:
						'Refresh token is required to renew the access token',
				});
			}
		} else {
			tokenDetails = { token: req.headers.authorization, type: 'access' };
			if (!tokenDetails.token) {
				return res.status(401).json({
					message:
						'Authentication failed: Please login to access the apis',
				});
			}
		}

		return jwt.verify(
			tokenDetails.token,
			process.env.JWT_SECRET,
			async (err, user) => {
				if (err) {
					console.log(err);
					return res.status(403).json({
						message:
							'Token verification is failed, so request is forbidden',
						code:
							tokenDetails.type === 'refresh'
								? 'INVALID_REFRESH_TOKEN'
								: 'INVALID_ACCESS_TOKEN',
					});
				}

				try {
					const reportPathMatch = req.path.match(
						/^(?:\/crap)?\/get-report-by-id\/([^/]+)\/report\/([^/]+)$/,
					);
					if (reportPathMatch) {
						const formID = reportPathMatch[1];
						const crapUser = await userAction.getCrapUser(
							user.email,
						);
						if (!crapUser) {
							return res.status(403).json({
								message:
									'User is not allowed to use this report',
								code: 'FORBIDDEN',
							});
						}

						const formData = await crapAction.getFormData(formID);
						if (!formData) {
							return res.status(404).json({
								message: 'Form data not found',
								code: 'FORM_DATA_NOT_FOUND',
							});
						}

						if (formData.userID !== crapUser.id) {
							return res.status(403).json({
								message:
									'User is not allowed to use this report',
								code: 'FORBIDDEN',
							});
						}
					}

					const profile = await userAction.getByEmail(user.email);
					if (!profile) {
						return res.status(404).json({
							message:
								'User not registered with Heydu, please check',
						});
					}

					if (
						req.path.includes('/update-institution') &&
						profile.profileTypeID !== 4 &&
						req.body.status
					) {
						return res.status(403).json({
							message:
								'You are not allowed to take this action on this profile',
						});
					}
					if (
						profile &&
						(profile.profileTypeID === 0 ||
							profile.profileTypeID === 1) &&
						['rejected', 'deleted', 'pending'].includes(
							profile.status,
						)
					) {
						statusBasedResponse(profile.status);
					}
					return next();
				} catch (e) {
					console.log(e);
					return res.status(500).json({
						message: 'Something went wrong',
						code: 'INTERNAL_SERVER_ERROR',
					});
				}
			},
		);
	},

	STATUS,
};
