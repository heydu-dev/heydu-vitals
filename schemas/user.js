const Joi = require('joi');

const InstitutionSchema = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().required(),
	alias: Joi.string()
		.pattern(/^[a-zA-Z0-9-_]+$/)
		.required(),
	countryCode: Joi.string().required(),
	stateID: Joi.string().required(),
	address: Joi.string().required(),
	email: Joi.string().email().required(),
	landmark: Joi.string().optional().allow(null),
	phone: Joi.string()
		.pattern(/^[0-9]+$/, 'numbers')
		.required(),
	alternatePhone: Joi.string()
		.pattern(/^[0-9]+$/, 'numbers')
		.optional()
		.allow(null),
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
	contact: Joi.string().pattern(/^[0-9]+$/, 'numbers'),
	alternateContact: Joi.string()
		.pattern(/^[0-9]+$/, 'numbers')
		.optional()
		.allow(null),
	landmark: Joi.string(),
	profileImgBinary: Joi.binary().allow(null).allow(''),
	status: Joi.string(),
});

const StaffSchema = Joi.object({
	name: Joi.string().trim().required(),
	email: Joi.string().trim().required(),
	profileImageBinary: Joi.string().trim(),
	designation: Joi.string().trim().required(),
	roleID: Joi.number().required(),
	institutionID: Joi.string().required(),
	departmentID: Joi.string().required(),
	gender: Joi.string().trim().required(),
});

const EditStaffSchema = Joi.object({
	name: Joi.string().trim().required(),
	email: Joi.string().trim().required(),
	profileImageBinary: Joi.string().trim().required(),
	designation: Joi.string().trim().required(),
	roleID: Joi.number().required(),
});

const StudentSchema = Joi.object({
	name: Joi.string().required(),
	startYear: Joi.date().iso().required(),
	finalYear: Joi.date().iso().min(Joi.ref('start_year')).required(),
	email: Joi.string().email().required(),
	degreeID: Joi.number().required(),
	departmentID: Joi.number().required(),
	specializationID: Joi.number().required(),
	institutionID: Joi.number().required(),
	registrationNumber: Joi.string()
		.pattern(/^[a-zA-Z0-9_.-]+$/) // Alphanumeric, underscore, dash, dot
		.required(),
	isAlumni: Joi.boolean(),
});

const EditStudentSchema = Joi.object({
	name: Joi.string(),
	alternateEmail: Joi.string(),
	phone: Joi.string(),
	stateID: Joi.string(),
	countryCode: Joi.string(),
});

const FollowerSchema = Joi.object({
	followingID: Joi.string().required(), // ID of the user being followed (if applicable)
	followingProfileTypeID: Joi.string().required(), // Profile type of the user being followed (if applicable)
	followerID: Joi.string().required(), // ID of the user following (if applicable)
	followerProfileTypeID: Joi.string().required(), // Pr
});

const GetFollowersSchema = Joi.object({
	followingID: Joi.string().required(), // ID of the user being followed (if applicable)
	limit: Joi.number().required(),
	offset: Joi.number().required(),
});

const GetFollowingSchema = Joi.object({
	followerID: Joi.string().required(), // ID of the user being followed (if applicable)
	limit: Joi.number().required(),
	offset: Joi.number().required(),
});

const GetInstitutionsSchema = Joi.object({
	profileTypeID: Joi.number().required(),
	filter: Joi.object().optional(),
});

module.exports = {
	StaffSchema,
	EditStaffSchema,
	StudentSchema,
	EditStudentSchema,
	FollowerSchema,
	GetFollowersSchema,
	GetFollowingSchema,
	InstitutionSchema,
	UpdateInstitutionSchema,
	GetInstitutionsSchema,
};
