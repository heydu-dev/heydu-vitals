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

const GetBatchSchema = Joi.object({
	departmentID: Joi.string().optional(),
	specialisationID: Joi.string().optional(),
	limit: Joi.number().required().max(10),
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.object().unknown(true),
		Joi.allow(null),
	),
});

const AddCourseSchema = Joi.object({
	departmentID: Joi.string().required(),
	specialisationID: Joi.string().required(),
	batchID: Joi.string().required(),
	semesterYear: Joi.string().required(),
	tag: Joi.string(),
	name: Joi.string().required(),
});

const AddClassMaterialSchema = Joi.object({
	uploadedBy: Joi.string().required(),
	materials: Joi.array()
		.items(
			Joi.object({
				name: Joi.string().required(),
				institutionID: Joi.string().required(),
				fileExtension: Joi.string().required(),
				courseID: Joi.string().required(),
				batchID: Joi.string().required(),
				year: Joi.string().required(),
				key: Joi.string()
					.guid({ version: ['uuidv4', 'uuidv5'] })
					.required(),
			}),
		)
		.required()
		.min(1),
});

const GetCourseSchema = Joi.object({
	departmentID: Joi.string().optional(),
	specialisationID: Joi.string().optional(),
	batchID: Joi.string().optional(),
	semesterYear: Joi.string().optional(),
	limit: Joi.number().required().max(10),
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.object().unknown(true),
		Joi.allow(null),
	),
});

const GetClassMaterialSchema = Joi.object({
	limit: Joi.number().required().max(10),
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.object().unknown(true),
		Joi.allow(null),
	),
});

module.exports = {
	DepartmentSchema,
	SpecialisationSchema,
	BatchSchema,
	GetBatchSchema,
	AddCourseSchema,
	AddClassMaterialSchema,
	GetCourseSchema,
	GetClassMaterialSchema,
};
