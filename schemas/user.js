const Joi = require('joi');

const uuidSchema = Joi.string().guid({ version: ['uuidv5', 'uuidv7'] });

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
		.optional(),
	countryID: Joi.string().required(),
	stateID: Joi.string().required(),
	email: Joi.string().email().trim().lowercase().required(),
	addressLineOne: Joi.string().optional(),
	addressLineTwo: Joi.string().optional(),
	phone: Joi.string()
		.pattern(/^[0-9]+$/, 'numbers')
		.optional(),
	universityID: Joi.string().optional(),
	profileImageKey: Joi.string().optional(),
	bannerImageKey: Joi.string().optional(),
	profileTypeID: Joi.number().valid(0, 1).required(),
	institutionTypeID: Joi.string().required(),
});

const UpdateInstitutionSchema = Joi.object({
	name: Joi.string(),
	description: Joi.string(),
	phone: Joi.string().pattern(/^[0-9]+$/, 'numbers'),
	addressLineOne: Joi.string(),
	addressLineTwo: Joi.string(),
	profileTypeID: Joi.number().valid(0, 1).required(),
	profileImageKey: Joi.string().optional(),
	bannerImageKey: Joi.string().optional(),
	status: Joi.string(),
});

const StaffSchema = Joi.object({
	name: Joi.string().trim().required(),
	email: Joi.string().email().trim().lowercase().required(),
	profileImageKey: Joi.string().optional(),
	bannerImageKey: Joi.string().optional(),
	designation: Joi.string().trim().required(),
	institutionID: Joi.string().required(),
	departmentID: Joi.string().required(),
	gender: Joi.string().trim().required(),
});

/** Bulk staff create: shared institution / department; gender per member row. */
const BulkStaffSchema = Joi.object({
	institutionID: Joi.string().required(),
	departmentID: Joi.string().required(),
	members: Joi.array()
		.items(
			Joi.object({
				name: Joi.string().trim().required(),
				email: Joi.string().email().trim().lowercase().required(),
				designation: Joi.string().trim().required(),
				gender: Joi.string().trim().required(),
			}),
		)
		.min(1)
		.max(500)
		.required(),
});

const EditStaffSchema = Joi.object({
	name: Joi.string().trim(),
	profileImageKey: Joi.string().optional(),
	bannerImageKey: Joi.string().optional(),
	designation: Joi.string().trim(),
	roleID: Joi.number(),
});

const StudentSchema = Joi.object({
	name: Joi.string().required(),
	startYear: Joi.date().iso().required(),
	finalYear: Joi.date().iso().min(Joi.ref('start_year')).required(),
	email: Joi.string().email().trim().lowercase().required(),
	degreeID: Joi.string().required(),
	departmentID: Joi.string().required(),
	specializationID: Joi.string().required(),
	institutionID: Joi.string().required(),
	bannerImageKey: Joi.string().optional(),
	registrationNumber: Joi.string()
		.pattern(/^[a-zA-Z0-9_.-]+$/) // Alphanumeric, underscore, dash, dot
		.required(),
	isAlumni: Joi.boolean().optional(),
});

const EditStudentSchema = Joi.object({
	name: Joi.string(),
	alternateEmail: Joi.string(),
	phone: Joi.string(),
	profileImageKey: Joi.string().optional(),
	bannerImageKey: Joi.string().optional(),
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
	profileImageKey: Joi.string().optional(),
	bannerImageKey: Joi.string().optional(),
});

const GetProfileKeySignedUrlsSchema = Joi.object({
	key: Joi.string().required(),
	profileEmail: Joi.string().email().required(),
});

const GetStudentsByBatchIDSchema = Joi.object({
	limit: Joi.number().required().min(1).max(10),
	/** Query string may be JSON-encoded DynamoDB key (same pattern as batch list). */
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.string(),
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
	BulkStaffSchema,
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
