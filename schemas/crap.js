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

// ---- CRAP dashboard v2 ----

const CrapV2ModuleSchema = Joi.object({
	name: Joi.string().trim().required(),
	videoR2Key: Joi.string().trim().allow('').optional(),
	exercisePrompt: Joi.string().trim().allow('').optional(),
	pathPrompt: Joi.string().trim().allow('').optional(),
	order: Joi.number().integer().optional(),
});

const UpdateCrapV2ModuleSchema = Joi.object({
	name: Joi.string().trim().optional(),
	videoR2Key: Joi.string().trim().allow('').optional(),
	exercisePrompt: Joi.string().trim().allow('').optional(),
	pathPrompt: Joi.string().trim().allow('').optional(),
	order: Joi.number().integer().optional(),
}).min(1);

const CrapVideoPresignSchema = Joi.object({
	fileName: Joi.string().trim().required(),
	contentType: Joi.string().trim().optional(),
});

const CrapMetadataSchema = Joi.object({
	introVideoR2Key: Joi.string().trim().allow('').optional(),
	text: Joi.array()
		.items(
			Joi.object({
				key: Joi.string().trim().required(),
				value: Joi.string().trim().required(),
			}),
		)
		.optional(),
});

const CrapPathGenerateSchema = Joi.object({
	exerciseId: Joi.string().trim().optional(),
	questions: Joi.array().items(Joi.object({
		id: Joi.string().trim().optional(),
		question: Joi.string().required(),
		options: Joi.array().items(Joi.string()).required(),
	})).optional(),
	selectedAnswers: Joi.object().pattern(Joi.string(), Joi.any()).required(),
}).or('exerciseId', 'questions').messages({
	'object.missing': 'Either exerciseId (to resolve a stored exercise) or questions (to supply them directly) is required',
});

const CrapProgressUpsertSchema = Joi.object({
	moduleId: Joi.string().trim().required(),
	section: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
	exerciseId: Joi.string().trim().optional(),
	currentQuestion: Joi.number().integer().min(0).optional(),
	answers: Joi.object().pattern(Joi.string(), Joi.any()).optional(),
	completed: Joi.boolean().optional(),
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
	CrapV2ModuleSchema,
	UpdateCrapV2ModuleSchema,
	CrapVideoPresignSchema,
	CrapMetadataSchema,
	CrapPathGenerateSchema,
	CrapProgressUpsertSchema,
};
