const Joi = require("joi");

module.exports = {

    RoleSchema: Joi.object({
        name: Joi.string().trim().required(),
        description: Joi.string().trim().required(),
        roleID: Joi.number().required(),
    }),

    ProfileTypeSchema: Joi.object({
        name: Joi.string().trim().required(),
        profileTypeID: Joi.number().required(),
    }),

    InstitutionTypeSchema: Joi.object({
        name: Joi.string().trim().required(),
    }),

    DegreeSchema: Joi.object({
        name: Joi.string().trim().required(),
    }),

    CountrySchema: Joi.object({
        showCountry: Joi.boolean().required(),
    }),
};

