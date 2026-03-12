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

module.exports = {
	CrapSignupSchema,
	CrapQuestionsSchema,
};
