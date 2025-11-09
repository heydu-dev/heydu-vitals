// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require('joi');

const CrapSignupSchema = Joi.object({
	email: Joi.string().email().trim().required(),
	name: Joi.string().trim().required(),
});

const CrapQuestionsSchema = Joi.object({
	email: Joi.string().email().required(),
	questions: Joi.object({
		branch: Joi.string().required(),
		year: Joi.string().required(),
		gpa: Joi.number().required(),
		field: Joi.string().required(),
		// plan: Joi.string().required(),
		isPlanningDifferentCountry: Joi.string().required(),
		specialisation: Joi.string().required(),
		jobRole: Joi.string().required(),
		personality: Joi.object({
			interaction: Joi.string().required().valid('Good', 'Ok', 'Bad'),
			organized: Joi.string().required().valid('Yes', 'No'),
			pressure: Joi.string().required().valid('Yes', 'No'),
			communication: Joi.string().required().valid('Good', 'Ok', 'Bad'),
			presentation: Joi.string().required().valid('Good', 'Ok', 'Bad'),
			email: Joi.string().required().valid('Good', 'Ok', 'Bad'),
		}),
		skill: Joi.object(),
		// experience: Joi.object({
		//     did_internship: Joi.string().required(),
		//     internship_experience: Joi.string(),
		//     learn_in_internship: Joi.string(),
		// }),
	}),
	orderInfo: Joi.object({}),
});

module.exports = {
	CrapSignupSchema,
	CrapQuestionsSchema,
};
