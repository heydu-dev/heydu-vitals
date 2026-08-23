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

// exerciseCount/pathPrompt/exercisePrompt are Section 2 (exercise-sequence)
// concepts; `prompt` is for Section 3 (assessment) modules, which have no
// exercise sequence. Same schema serves both — a module only sets the
// fields relevant to its own section.
const CrapV2ModuleSchema = Joi.object({
	name: Joi.string().trim().required(),
	videoR2Key: Joi.string().trim().allow('').optional(),
	exercisePrompt: Joi.string().trim().allow('').optional(),
	pathPrompt: Joi.string().trim().allow('').optional(),
	exerciseCount: Joi.number().integer().min(1).optional(),
	prompt: Joi.string().trim().allow('').optional(),
	order: Joi.number().integer().optional(),
});

const UpdateCrapV2ModuleSchema = Joi.object({
	name: Joi.string().trim().optional(),
	videoR2Key: Joi.string().trim().allow('').optional(),
	exercisePrompt: Joi.string().trim().allow('').optional(),
	pathPrompt: Joi.string().trim().allow('').optional(),
	exerciseCount: Joi.number().integer().min(1).optional(),
	prompt: Joi.string().trim().allow('').optional(),
	order: Joi.number().integer().optional(),
}).min(1);

// ---- CRAP dashboard v2: Section 3 (assessment) module question bank ----

// An option's `nextQuestionId` overrides the question's own `nextQuestionId`
// when that option is selected; a question with neither set is a dead end
// (last question on that path). Resolution: selectedOption.nextQuestionId
// ?? question.nextQuestionId ?? null.
const CrapV2QuestionOptionSchema = Joi.object({
	id: Joi.string().trim().required(),
	text: Joi.string().trim().required(),
	nextQuestionId: Joi.string().trim().optional(),
});

const CrapV2QuestionFieldSchema = Joi.object({
	id: Joi.string().trim().required(),
	label: Joi.string().trim().required(),
});

// "select" (default): fixed admin-authored options, branch per option.
// "ai_select": no static options — frontend generates choices at runtime via
// the existing AI assessment-question job; can only branch via the
// question-level nextQuestionId (choices aren't known ahead of time).
// "form": a small free-text detail capture (`fields` instead of `options`),
// no branching.
const CrapV2QuestionSchema = Joi.object({
	question: Joi.string().trim().required(),
	// Cosmetic grouping label (e.g. "education", "overseas") — display only,
	// doesn't affect branching or which module a question is stored under.
	topic: Joi.string().trim().optional(),
	// Marks the entry point of a module's question tree. Modules aren't
	// backend-managed for Section 3, so the start lives on the question.
	isStart: Joi.boolean().optional(),
	nextQuestionId: Joi.string().trim().optional(),
	type: Joi.string().valid('select', 'ai_select', 'form').default('select'),
	options: Joi.array().items(CrapV2QuestionOptionSchema).min(2).when('type', {
		is: 'select',
		then: Joi.required(),
		otherwise: Joi.forbidden(),
	}),
	multiSelect: Joi.boolean().when('type', {
		is: 'ai_select',
		then: Joi.optional(),
		otherwise: Joi.forbidden(),
	}),
	fields: Joi.array().items(CrapV2QuestionFieldSchema).min(1).when('type', {
		is: 'form',
		then: Joi.required(),
		otherwise: Joi.forbidden(),
	}),
	order: Joi.number().integer().optional(),
});

// Partial update — kept loose like the other Update* schemas: whatever
// fields are sent get validated for shape, but there's no cross-field
// type-vs-options/fields enforcement (the existing item may already be the
// right shape; re-sending `type` alongside a change is on the caller).
const UpdateCrapV2QuestionSchema = Joi.object({
	question: Joi.string().trim().optional(),
	topic: Joi.string().trim().optional(),
	isStart: Joi.boolean().optional(),
	nextQuestionId: Joi.string().trim().optional(),
	type: Joi.string().valid('select', 'ai_select', 'form').optional(),
	options: Joi.array().items(CrapV2QuestionOptionSchema).min(2).optional(),
	multiSelect: Joi.boolean().optional(),
	fields: Joi.array().items(CrapV2QuestionFieldSchema).min(1).optional(),
	order: Joi.number().integer().optional(),
}).min(1);

/**
 * Body for the AI-generated assessment question endpoint. `prompt` is
 * built entirely client-side (frontend concatenates its own base prompt
 * with the student's prior questions/answers) — the server treats it as
 * an opaque string and forwards it to the LLM as-is, no substitution.
 */
const CrapAssessmentGenerateSchema = Joi.object({
	prompt: Joi.string().trim().min(1).required(),
});

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
	questions: Joi.array()
		.items(
			Joi.object({
				id: Joi.string().trim().optional(),
				question: Joi.string().required(),
				options: Joi.array().items(Joi.string()).required(),
			}),
		)
		.optional(),
	selectedAnswers: Joi.object().pattern(Joi.string(), Joi.any()).required(),
})
	.or('exerciseId', 'questions')
	.messages({
		'object.missing':
			'Either exerciseId (to resolve a stored exercise) or questions (to supply them directly) is required',
	});

const CrapProgressUpsertSchema = Joi.object({
	moduleId: Joi.string().trim().required(),
	exerciseNumber: Joi.number().integer().min(1).required(),
	section: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
	exerciseId: Joi.string().trim().optional(),
	currentQuestion: Joi.number().integer().min(0).optional(),
	answers: Joi.object().pattern(Joi.string(), Joi.any()).optional(),
	completed: Joi.boolean().optional(),
});

// Section 3 (assessment) progress — moduleId/sectionId come from the URL
// path (see PUT/GET .../modules/:moduleId/assessment-progress), not the
// body. Unlike CrapProgressUpsertSchema there's no exerciseNumber: a
// Section 3 module is one branching flow, not N numbered exercises.
// answers values are opaque per question type (string / string[] / an
// object keyed by field id for "form" questions) — same Joi.any() looseness
// CrapProgressUpsertSchema already uses.
const CrapAssessmentProgressUpsertSchema = Joi.object({
	currentQuestionId: Joi.string().trim().optional(),
	answers: Joi.object().pattern(Joi.string(), Joi.any()).optional(),
	completed: Joi.boolean().optional(),
}).min(1);

// Explicitly set by the frontend when it decides a section is done and
// moves the student forward — not derived/recomputed server-side from
// module completion. `section` is opaque (whatever the frontend calls its
// sections — "2", "3", ...), same alternatives() looseness as
// CrapProgressUpsertSchema.section.
const CrapCurrentSectionUpsertSchema = Joi.object({
	section: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
});

// A section's single admin-authored prompt (e.g. Section 4's roadmap
// prompt) — not tied to a module, unlike Section 2's per-module
// exercisePrompt/pathPrompt. Sent verbatim as the sole LLM user message
// after placeholder substitution, so (like those) it must specify the
// desired JSON output shape itself.
const CrapSectionPromptUpsertSchema = Joi.object({
	prompt: Joi.string().trim().min(1).required(),
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
	CrapV2QuestionSchema,
	UpdateCrapV2QuestionSchema,
	CrapAssessmentGenerateSchema,
	CrapVideoPresignSchema,
	CrapMetadataSchema,
	CrapPathGenerateSchema,
	CrapProgressUpsertSchema,
	CrapAssessmentProgressUpsertSchema,
	CrapCurrentSectionUpsertSchema,
	CrapSectionPromptUpsertSchema,
};
