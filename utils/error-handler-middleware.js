const { API_RESPONSES, getApiResponse } = require('./api-responses');

function resolveResponseKey(err, statusCode) {
	if (err.apiResponseKey && API_RESPONSES[err.apiResponseKey]) {
		return err.apiResponseKey;
	}

	return (
		Object.keys(API_RESPONSES).find(
			(key) => API_RESPONSES[key].httpStatus === statusCode,
		) || 'INTERNAL_SERVER_ERROR'
	);
}

module.exports = {
	ErrorHandler: (err, req, res) => {
		const msg = `\n--------------------------------\npath: ${req.originalUrl}
        \nbody: ${JSON.stringify(req.body || {})}\n
        ${err.stack}\n--------------------------------`;
		console.log(msg);

		const statusCode = err.statusCode || err.status || 500;
		const responseKey = resolveResponseKey(err, statusCode);
		const responseTemplate = API_RESPONSES[responseKey];
		const responsePayload = getApiResponse(responseKey, {
			httpStatus: statusCode,
			message: err.message || responseTemplate.message,
			code: err.code || responseTemplate.code,
		});

		const body = {
			success: false,
			status: responsePayload.httpStatus,
			code: responsePayload.code,
			message: responsePayload.message,
		};

		if (err.details) {
			body.details = err.details;
		}

		if (['dev', 'local'].includes(process.env.NODE_ENV)) {
			body.stack = err.stack;
		}

		res.status(responsePayload.httpStatus).json(body);
	},
};
