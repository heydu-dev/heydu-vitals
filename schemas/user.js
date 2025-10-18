const Joi = require('joi');

const uuidSchema = Joi.string().guid({ version: ['uuidv4', 'uuidv5'] });

const RegisterDeviceTokenSchema = Joi.object({
	deviceToken: Joi.string().required(),
	deviceType: Joi.string().required(),
	userID: Joi.string().required(),
	applicationID: Joi.string().required(),
});

const InstitutionSchema = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().required(),
	alias: Joi.string()
		.pattern(/^[a-zA-Z0-9-_]+$/)
		.required(),
	countryID: Joi.string().required(),
	stateID: Joi.string().required(),
	address: Joi.string().required(),
	email: Joi.string().email().required(),
	landmark: Joi.string().optional(),
	phone: Joi.string()
		.pattern(/^[0-9]+$/, 'numbers')
		.required(),
	alternatePhone: Joi.string()
		.pattern(/^[0-9]+$/, 'numbers')
		.optional()
		.allow(null),
	universityID: Joi.string().optional(),
	profileImageURL: Joi.binary().optional(),
	profileTypeID: Joi.number().valid(0, 1).required(),
	institutionTypeID: Joi.string().required(),
	roleID: Joi.number().required(),
});

const UpdateInstitutionSchema = Joi.object({
	name: Joi.string(),
	description: Joi.string(),
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
	profileTypeID: Joi.number().valid(0, 1).required(),
	profileImageURL: Joi.binary().allow(null).allow(''),
	status: Joi.string(),
});

const StaffSchema = Joi.object({
	name: Joi.string().trim().required(),
	email: Joi.string().trim().required(),
	profileImageURL: Joi.string().trim(),
	designation: Joi.string().trim().required(),
	roleID: Joi.number().required(),
	institutionID: Joi.string().required(),
	specialisationID: Joi.string().required(),
	departmentID: Joi.string().required(),
	gender: Joi.string().trim().required(),
});

const EditStaffSchema = Joi.object({
	name: Joi.string().trim(),
	email: Joi.string().trim(),
	profileImageURL: Joi.string().trim(),
	designation: Joi.string().trim(),
	departmentID: Joi.string().trim(),
	specialisationID: Joi.string().trim(),
	roleID: Joi.number(),
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
	registrationNumber: Joi.string(),
	stateID: Joi.string(),
	countryCode: Joi.string(),
	profileImageURL: Joi.string(),
});

const FollowerSchema = Joi.object({
	followingID: Joi.string().required(), // ID of the user being followed (if applicable)
	followingProfileTypeID: Joi.number().required(), // Profile type of the user being followed (if applicable)
	followerID: Joi.string().required(), // ID of the user following (if applicable)
	followerProfileTypeID: Joi.number().required(), // Profile type of the user following (if applicable)
});

const GetFollowersFollowingsSchema = Joi.object({
	profileUserID: Joi.string().required(), // ID of the user being followed (if applicable)
	followingProfileTypeID: Joi.number().required(), // Profile type of the user being followed (if applicable)
	limit: Joi.number().max(10).required(),
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.object().unknown(true),
		Joi.allow(null),
	),
});

const GetInstitutionsSchema = Joi.object({
	profileTypeID: Joi.number().required(),
	filters: Joi.string().optional(),
});

const AdminSchema = Joi.object({
	email: Joi.string().email().required(),
	name: Joi.string().required(),
	profileImageURL: Joi.string().optional(),
});

const GetProfileKeySignedUrlsSchema = Joi.object({
	key: Joi.string().required(),
	profileEmail: Joi.string().email().required(),
});

const GetStudentsByBatchIDSchema = Joi.object({
	limit: Joi.number().required().max(10),
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.object().unknown(true),
		Joi.allow(null),
	),
});

const GetPostUsersSchema = Joi.object({
	userIDs: Joi.array().items(uuidSchema).min(1).required(),
});

module.exports = {
	AdminSchema,
	StaffSchema,
	EditStaffSchema,
	StudentSchema,
	EditStudentSchema,
	FollowerSchema,
	GetFollowersFollowingsSchema,
	InstitutionSchema,
	UpdateInstitutionSchema,
	GetInstitutionsSchema,
	GetProfileKeySignedUrlsSchema,
	GetStudentsByBatchIDSchema,
	GetPostUsersSchema,
	RegisterDeviceTokenSchema,
};
