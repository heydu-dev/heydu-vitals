const { API_RESPONSES } = require('./constants');

function getApiResponse(key, overrides = {}) {
	const baseResponse = API_RESPONSES[key];

	if (!baseResponse) {
		throw new Error(`Unknown API response key: ${key}`);
	}

	return {
		...baseResponse,
		...overrides,
	};
}

function createSuccessResponse(res, key, { message, data } = {}) {
	const responseTemplate = getApiResponse(key, message ? { message } : {});
	const body = {
		success: true,
		status: responseTemplate.httpStatus,
		code: responseTemplate.code,
		message: responseTemplate.message,
	};

	if (data !== undefined) {
		body.data = data;
	}

	return res.status(responseTemplate.httpStatus).json(body);
}

function createErrorResponse(
	key,
	{ message, details, statusCode } = {},
	err = null,
) {
	const responseTemplate = getApiResponse(key, message ? { message } : {});
	const error = new Error(responseTemplate.message);
	error.statusCode = statusCode;
	error.apiResponseKey = key;
	error.code = responseTemplate.code;
	error.message = responseTemplate.message;
	if (details) {
		error.details = details;
	}
	if (err) {
		error.stack = err.stack;
	}
	return error;
}

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

function ErrorHandler(err, req, res) {
	const msg = `\n--------------------------------\npath: ${req.originalUrl}
    \nbody: ${JSON.stringify(req.body || {})}\n
    ${err.stack}\n--------------------------------`;
	// eslint-disable-next-line no-console
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

	if (process.env.NODE_ENV === 'dev') {
		body.stack = err.stack;
	}

	res.status(responsePayload.httpStatus).json(body);
}

module.exports = {
	getApiResponse,
	createSuccessResponse,
	createErrorResponse,
	ErrorHandler,
};
