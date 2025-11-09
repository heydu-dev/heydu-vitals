// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require('joi');

const OTPSchema = Joi.object({
	email: Joi.string().email().trim().required(),
	appType: Joi.string().optional(),
});

const ValidateOTPSchema = Joi.object({
	email: Joi.string().email().trim().required(),
	name: Joi.string().trim().optional(),
	otp: Joi.string().trim().required(),
	appType: Joi.string().optional(),
});

const RefreshTokenSchema = Joi.object({
	refreshToken: Joi.string().trim().required(),
	email: Joi.string().email().trim().required(),
});

module.exports = {
	OTPSchema,
	ValidateOTPSchema,
	RefreshTokenSchema,
};
