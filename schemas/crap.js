// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require('joi');

const CrapSignupSchema = Joi.object({
	email: Joi.string().email().trim().required(),
	name: Joi.string().trim().required(),
});

const CrapQuestionsSchema = Joi.object({
	email: Joi.string().email().required(),
	userID: Joi.string().required(),
	formData: Joi.object({
		degree: Joi.string().required(),
		branch: Joi.string().required(),
		year: Joi.string().required(),
		specialisation: Joi.string().required(),
		jobRole: Joi.string().required(),
		personality: Joi.object({
			communication: Joi.string()
				.required()
				.valid('Good', 'Average', 'Bad'),
			workWithTeam: Joi.string()
				.required()
				.valid('Good', 'Average', 'Bad'),
			presentation: Joi.string()
				.required()
				.valid('Good', 'Average', 'Bad'),
			timeManagement: Joi.string()
				.required()
				.valid('Good', 'Average', 'Bad'),
			problemSolving: Joi.string()
				.required()
				.valid('Good', 'Average', 'Bad'),
		}),
		countryToBuildCareer: Joi.string().required(),
	}),
	orderInfo: Joi.string().allow('').allow(null).required(),
});

const UpdateCrapQuestionsSchema = Joi.object({
	formData: Joi.object({
		countryToBuildCareer: Joi.string().optional(),
	}).optional(),
	orderInfo: Joi.string().allow('').allow(null).optional(),
})
	.or('formData', 'orderInfo')
	.messages({
		'object.missing': 'At least one of formData or orderInfo is required',
	});

const BuyCrapBulkReportSchema = Joi.object({
	institutionID: Joi.string().trim().required(),
	departmentID: Joi.string().trim().required(),
	specialisationID: Joi.string().trim().required(),
	batchID: Joi.string().trim().optional(),
	batchYear: Joi.string().trim().optional(),
	batchDetails: Joi.string().trim().allow('').optional(),
});

const AdminCrapBulkTokenSchema = Joi.object({
	institutionID: Joi.string().trim().required(),
	departmentID: Joi.string().trim().required(),
	specialisationID: Joi.string().trim().optional(),
	batchID: Joi.string().trim().optional(),
}).with('batchID', 'specialisationID');

const CheckCrapBulkTokenEligibilitySchema = Joi.object({
	tokenNumber: Joi.string().trim().alphanum().max(6).required(),
});

const RedeemCrapBulkTokenSchema = Joi.object({
	tokenNumber: Joi.string().trim().alphanum().max(6).required(),
	formData: Joi.object({
		degree: Joi.string().required(),
		branch: Joi.string().required(),
		year: Joi.string().required(),
		specialisation: Joi.string().required(),
		jobRole: Joi.string().required(),
		personality: Joi.object({
			communication: Joi.string()
				.required()
				.valid('Good', 'Average', 'Bad'),
			workWithTeam: Joi.string()
				.required()
				.valid('Good', 'Average', 'Bad'),
			presentation: Joi.string()
				.required()
				.valid('Good', 'Average', 'Bad'),
			timeManagement: Joi.string()
				.required()
				.valid('Good', 'Average', 'Bad'),
			problemSolving: Joi.string()
				.required()
				.valid('Good', 'Average', 'Bad'),
		}),
		countryToBuildCareer: Joi.string().required(),
	}).required(),
});

const DeactivateCrapBulkTokenSchema = Joi.object({
	tokenNumber: Joi.string().trim().alphanum().max(6).required(),
});

module.exports = {
	CrapSignupSchema,
	CrapQuestionsSchema,
	UpdateCrapQuestionsSchema,
	BuyCrapBulkReportSchema,
	AdminCrapBulkTokenSchema,
	CheckCrapBulkTokenEligibilitySchema,
	RedeemCrapBulkTokenSchema,
	DeactivateCrapBulkTokenSchema,
};
