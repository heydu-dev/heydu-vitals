// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require('joi');

const DepartmentSchema = Joi.object({
	name: Joi.string().trim().required(),
	institutionID: Joi.string().required(),
});

const SpecialisationSchema = Joi.object({
	name: Joi.string().trim().required(),
	departmentID: Joi.string().required(),
	degreeID: Joi.string().required(),
	institutionID: Joi.string().required(),
});

const BatchSchema = Joi.object({
	departmentID: Joi.string().required(),
	specialisationID: Joi.string().required(),
	institutionID: Joi.string().required(),
	degreeID: Joi.string().required(),
	startYear: Joi.string().required(),
	endYear: Joi.string().required(),
	excelFileID: Joi.string().required(),
	actualExcelFileName: Joi.string().required(),
});

module.exports = {
	DepartmentSchema,
	SpecialisationSchema,
	BatchSchema,
};
