const Joi = require('joi');

const RoleSchema = Joi.object({
	name: Joi.string().trim().required(),
	description: Joi.string().trim().required(),
	roleID: Joi.number().required(),
});

const ProfileTypeSchema = Joi.object({
	name: Joi.string().trim().required(),
	profileTypeID: Joi.number().required(),
});

const InstitutionTypeSchema = Joi.object({
	name: Joi.string().trim().required(),
});

const DegreeSchema = Joi.object({
	name: Joi.string().trim().required(),
});

const CountrySchema = Joi.object({
	showCountry: Joi.boolean().required(),
});

const CollegeSchema = Joi.object({
	country: Joi.string().trim().required(),
	collegeName: Joi.string().trim().required(),
	urlStatus: Joi.string().valid('not_started', 'completed').required(),
});

module.exports = {
	RoleSchema,
	ProfileTypeSchema,
	InstitutionTypeSchema,
	DegreeSchema,
	CountrySchema,
	CollegeSchema,
};
