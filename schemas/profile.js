const Joi = require("joi");

const InstitutionSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    alias: Joi.string().pattern(/^[a-zA-Z0-9-_]+$/).required(),
    countryCode: Joi.string().required(),
    stateID: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().email().required(),
    landmark: Joi.string().optional().allow(null),
    phone: Joi.string().pattern(/^[0-9]+$/, "numbers").required(),
    alternatePhone: Joi.string().pattern(/^[0-9]+$/, "numbers").optional().allow(null),
    universityID: Joi.string().optional().allow(null),
    profileImageBinary: Joi.binary().optional().allow(null),
    profileTypeID: Joi.number().valid(0, 1).required(),
    institutionTypeID: Joi.string().required(),
    roleID: Joi.number().required(),
});

const UpdateInstitutionSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    shortName: Joi.string(),
    countryCode: Joi.string(),
    state: Joi.number(),
    address: Joi.string(),
    email: Joi.string().email(),
    contact: Joi.string().pattern(/^[0-9]+$/, "numbers"),
    alternateContact: Joi.string().pattern(/^[0-9]+$/, "numbers").optional().allow(null),
    landmark: Joi.string(),
    profileImgBinary: Joi.binary().allow(null).allow(""),
    status: Joi.string(),
});

module.exports = { InstitutionSchema, UpdateInstitutionSchema };
