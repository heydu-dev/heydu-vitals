const { schemaCheck } = require('./schema-checker');
const sendEmail = require('./send-email');
const { USER_STATUS, API_RESPONSES } = require('./constants');
const {
	getApiResponse,
	createSuccessResponse,
	createErrorResponse,
	ErrorHandler,
} = require('./api-response-handler');
const { generateJWT, authenticateJWT } = require('./jwt-session');
const awsS3Helper = require('./aws-s3-helper');
const {
	MAX_FOLLOWER_SHARDS,
	MAX_INSTITUTION_SHARDS,
	FOLLOWER_SHARD_VERSION,
	getShardNumber,
} = require('./shard-utils');

module.exports = {
	schemaCheck,
	sendEmail,
	USER_STATUS,
	API_RESPONSES,
	getApiResponse,
	createSuccessResponse,
	createErrorResponse,
	ErrorHandler,
	generateJWT,
	authenticateJWT,
	awsS3Helper,
	MAX_FOLLOWER_SHARDS,
	MAX_INSTITUTION_SHARDS,
	FOLLOWER_SHARD_VERSION,
	getShardNumber,
};
