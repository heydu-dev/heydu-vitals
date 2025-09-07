/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable default-case */
const jwt = require('jsonwebtoken');
const { userAction } = require('data-wolf');

function skippingRoutes() {
	const SKIP_ROUTES = [
		'/send-otp',
		'/register',
		'/validate-otp',
		'/logout',
		// "/api/admin/auth/send-otp",
		// "/api/admin/auth/validate-otp",
		'/degrees',
		'/get-states',
		// "/api/region/get-countries",
		'/get-visible-countries',
		'/list-universities',
		'/institution-types',
	];
	return SKIP_ROUTES;
}

// eslint-disable-next-line consistent-return
function statusBasedResponse(status, res, next) {
	switch (status) {
		case 'deleted':
			return res.status(400).json({
				message:
					'Your profile is deleted, please contact support for further details',
			});
		case 'rejected':
			return res.status(400).json({
				message:
					'Your profile is rejected, please contact support for further details',
			});
		case 'pending':
			return res.status(400).json({
				message:
					'Your profile is pending for approval, please wait for sometime',
			});
		case 'approved':
			next();
	}
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
			(err, user) => {
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
				userAction
					.getByEmail(user.email)
					.then((profile) => {
						if (!profile) {
							return res.status(404).json({
								message:
									'User not registered with Heydu, please check',
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
							return statusBasedResponse(
								profile.status,
								res,
								next,
							);
						}
						next();
					})
					.catch((e) => {
						console.log(e);
						res.status(500).json({
							message: 'Something went wrong',
							code: 'INTERNAL_SERVER_ERROR',
						});
					});
			},
		);
	},
};
