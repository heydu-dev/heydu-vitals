const Joi = require('joi');

const RoleSchema = Joi.object({
	key: Joi.string().trim().lowercase().pattern(/^[a-z][a-z0-9_.-]{1,79}$/),
	name: Joi.string().trim().required(),
	description: Joi.string().trim().allow('').default(''),
	permissions: Joi.array().items(Joi.string().trim().min(2).max(100)).unique().max(100).default([]),
});

const RoleUpdateSchema = Joi.object({
	name: Joi.string().trim().min(1).max(100),
	description: Joi.string().trim().allow('').max(500),
	permissions: Joi.array().items(Joi.string().trim().min(2).max(100)).unique().max(100),
	active: Joi.boolean(),
}).min(1);

const PermissionSchema = Joi.object({
	key: Joi.string().trim().lowercase().pattern(/^[a-z][a-z0-9_.-]{1,79}$/).required(),
	name: Joi.string().trim().min(1).max(100).required(),
	description: Joi.string().trim().allow('').max(500).default(''),
	category: Joi.string().trim().min(1).max(80).default('Custom'),
});

const PermissionUpdateSchema = Joi.object({
	name: Joi.string().trim().min(1).max(100),
	description: Joi.string().trim().allow('').max(500),
	category: Joi.string().trim().min(1).max(80),
	active: Joi.boolean(),
}).min(1);

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
	RoleUpdateSchema,
	PermissionSchema,
	PermissionUpdateSchema,
	ProfileTypeSchema,
	InstitutionTypeSchema,
	DegreeSchema,
	CountrySchema,
	CollegeSchema,
};
