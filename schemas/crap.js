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

const CrapModuleSchema = Joi.object({
	name: Joi.string().trim().required(),
	slug: Joi.string().trim().optional(),
	type: Joi.string()
		.trim()
		.valid('content', 'assessment', 'external')
		.default('content'),
	order: Joi.number().integer().optional(),
});

const UpdateCrapModuleSchema = Joi.object({
	name: Joi.string().trim().optional(),
	slug: Joi.string().trim().optional(),
	type: Joi.string()
		.trim()
		.valid('content', 'assessment', 'external')
		.optional(),
	order: Joi.number().integer().optional(),
});

const CrapTopicSchema = Joi.object({
	name: Joi.string().trim().required(),
	slug: Joi.string().trim().optional(),
	order: Joi.number().integer().optional(),
});

const UpdateCrapTopicSchema = Joi.object({
	name: Joi.string().trim().optional(),
	slug: Joi.string().trim().optional(),
	order: Joi.number().integer().optional(),
});

const CrapSectionSchema = Joi.object({
	title: Joi.string().trim().required(),
	introVideoR2Key: Joi.string().trim().allow('').optional(),
	order: Joi.number().integer().optional(),
});

const UpdateCrapSectionSchema = Joi.object({
	title: Joi.string().trim().optional(),
	introVideoR2Key: Joi.string().trim().allow('').optional(),
	order: Joi.number().integer().optional(),
});

const CrapQuestionSchema = Joi.object({
	question: Joi.string().trim().required(),
	options: Joi.array().items(Joi.string().trim().required()).length(4).required(),
	correctAnswer: Joi.string().trim().required(),
	sectionID: Joi.string().trim().allow('').optional(),
	difficulty: Joi.string().trim().valid('Easy', 'Medium', 'Hard').optional(),
	source: Joi.string().trim().valid('manual', 'ai').default('manual'),
});

const UpdateCrapQuestionSchema = Joi.object({
	question: Joi.string().trim().optional(),
	options: Joi.array().items(Joi.string().trim().required()).length(4).optional(),
	correctAnswer: Joi.string().trim().optional(),
	sectionID: Joi.string().trim().allow('').optional(),
	difficulty: Joi.string().trim().valid('Easy', 'Medium', 'Hard').optional(),
	source: Joi.string().trim().valid('manual', 'ai').optional(),
});

const CrapUploadPresignSchema = Joi.object({
	topicSlug: Joi.string().trim().required(),
	fileName: Joi.string().trim().required(),
	contentType: Joi.string().trim().optional(),
});

const CrapUploadSaveSchema = Joi.object({
	topicSlug: Joi.string().trim().required(),
	r2Key: Joi.string().trim().required(),
	fileName: Joi.string().trim().optional(),
	size: Joi.number().integer().min(0).optional(),
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

const CrapProgressSchema = Joi.object({
	state: Joi.object().pattern(Joi.string(), Joi.any()).required(),
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
	CrapModuleSchema,
	UpdateCrapModuleSchema,
	CrapTopicSchema,
	UpdateCrapTopicSchema,
	CrapSectionSchema,
	UpdateCrapSectionSchema,
	CrapQuestionSchema,
	UpdateCrapQuestionSchema,
	CrapUploadPresignSchema,
	CrapUploadSaveSchema,
	CrapMetadataSchema,
	CrapProgressSchema,
};
