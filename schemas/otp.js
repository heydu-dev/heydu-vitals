// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require("joi");

const OTPSchema = Joi.object({
    email: Joi.string().email().required(),
});

const ValidateOTPSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().integer().required(),
});

module.exports = {
    OTPSchema,
    ValidateOTPSchema,
};
