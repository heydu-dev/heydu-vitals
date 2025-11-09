const USER_STATUS = {
	PENDING: 'pending',
	APPROVED: 'approved',
	REJECTED: 'rejected',
	DELETED: 'deleted',
};

const CIRCLE_TYPES = {
	college: 'COLLEGE',
	followers: 'FOLLOWERS',
	everyone: 'EVERYONE',
	class: 'CLASS',
};

const API_RESPONSES = {
	SUCCESS: {
		httpStatus: 200,
		code: 'FALCON_SUCCESS',
		message: 'Request processed successfully.',
	},
	CREATED: {
		httpStatus: 201,
		code: 'FALCON_CREATED',
		message: 'Resource created successfully.',
	},
	ACCEPTED: {
		httpStatus: 202,
		code: 'FALCON_ACCEPTED',
		message: 'Request accepted for processing.',
	},
	NO_CONTENT: {
		httpStatus: 204,
		code: 'FALCON_NO_CONTENT',
		message: 'Request processed with no content to return.',
	},
	BAD_REQUEST: {
		httpStatus: 400,
		code: 'FALCON_BAD_REQUEST',
		message:
			'The request could not be understood or was missing required parameters.',
	},
	UNAUTHORIZED: {
		httpStatus: 401,
		code: 'FALCON_UNAUTHORIZED',
		message: 'Authentication credentials were missing or invalid.',
	},
	FORBIDDEN: {
		httpStatus: 403,
		code: 'FALCON_FORBIDDEN',
		message: 'You do not have permission to access the requested resource.',
	},
	NOT_FOUND: {
		httpStatus: 404,
		code: 'FALCON_NOT_FOUND',
		message: 'The requested resource could not be found.',
	},
	CONFLICT: {
		httpStatus: 409,
		code: 'FALCON_CONFLICT',
		message: 'A conflict occurred with the current state of the resource.',
	},
	UNPROCESSABLE_ENTITY: {
		httpStatus: 422,
		code: 'FALCON_UNPROCESSABLE_ENTITY',
		message: 'The request was well-formed but could not be processed.',
	},
	TOO_MANY_REQUESTS: {
		httpStatus: 429,
		code: 'FALCON_TOO_MANY_REQUESTS',
		message: 'Too many requests have been made in a given amount of time.',
	},
	INTERNAL_SERVER_ERROR: {
		httpStatus: 500,
		code: 'FALCON_INTERNAL_ERROR',
		message: 'An unexpected error occurred while processing the request.',
	},
	SERVICE_UNAVAILABLE: {
		httpStatus: 503,
		code: 'FALCON_SERVICE_UNAVAILABLE',
		message: 'The service is currently unable to handle the request.',
	},
};

module.exports = {
	USER_STATUS,
	CIRCLE_TYPES,
	API_RESPONSES,
};
