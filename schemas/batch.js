// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require('joi');

const DepartmentSchema = Joi.object({
	name: Joi.string().trim().required(),
	institutionID: Joi.string().required(),
});

/** Bulk department create: display names only (Excel / UI parses to this array). */
const BulkDepartmentsSchema = Joi.object({
	institutionID: Joi.string().required(),
	names: Joi.array().items(Joi.string()).min(1).max(2000).required(),
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
	/** Optional section label (e.g. A, B) — omit or empty if not used */
	section: Joi.string().trim().allow('').optional(),
});

const GetBatchSchema = Joi.object({
	departmentID: Joi.string().optional(),
	specialisationID: Joi.string().optional(),
	/** When set with department + specialisation, uses GSI_6 (batches for that section; empty = no section) */
	section: Joi.string().allow('').optional(),
	limit: Joi.number().required().max(10),
	/** Query strings are always strings; gateway passes JSON-encoded DynamoDB key */
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.string(),
		Joi.object().unknown(true),
		Joi.allow(null),
	),
});

/** Permanently delete a batch: students, DynamoDB batch row, and S3 upload. */
const DeleteBatchSchema = Joi.object({
	institutionID: Joi.string().required(),
	excelFileID: Joi.string().required(),
	batchID: Joi.string().required(),
});

const AddCourseSchema = Joi.object({
	departmentID: Joi.string().required(),
	specialisationID: Joi.string().required(),
	batchID: Joi.string().required(),
	semesterYear: Joi.string().required(),
	tag: Joi.string(),
	name: Joi.string().required(),
});

/** Request presigned PUT URLs before upload — no r2Key yet */
const ClassMaterialPresignSchema = Joi.object({
	uploadedBy: Joi.string().required(),
	materials: Joi.array()
		.items(
			Joi.object({
				name: Joi.string().optional(),
				institutionID: Joi.string().required(),
				fileExtension: Joi.string().required(),
				courseID: Joi.string().required(),
				batchID: Joi.string().required(),
				year: Joi.string().required(),
				fileKey: Joi.string()
					.guid({ version: ['uuidv5', 'uuidv7'] })
					.required(),
				fileSize: Joi.number().required(),
			}),
		)
		.required()
		.min(1),
});

/** Persist metadata after successful upload to R2 */
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
				fileKey: Joi.string()
					.guid({ version: ['uuidv5', 'uuidv7'] })
					.required(),
				fileSize: Joi.number().required(),
				/** Full R2 object key returned as `bucketPath` from class-material-signed-url */
				r2Key: Joi.string().required(),
			}),
		)
		.required()
		.min(1),
});

const DeleteClassMaterialSchema = Joi.object({
	courseID: Joi.string().required(),
	classMaterialID: Joi.string().required(),
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
	institutionID: Joi.string(),
	batchID: Joi.string(),
	year: Joi.string(),
	limit: Joi.number().required().max(10),
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.object().unknown(true),
		Joi.allow(null),
	),
});

/** GET granular list: GSI_2 partition = institution#batch#year#course */
const GetClassMaterialScopeSchema = Joi.object({
	institutionID: Joi.string().required(),
	batchID: Joi.string().required(),
	year: Joi.string().required(),
	courseID: Joi.string().required(),
	limit: Joi.number().required().max(10),
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.string(),
		Joi.object().unknown(true),
		Joi.allow(null),
	),
});

module.exports = {
	DepartmentSchema,
	BulkDepartmentsSchema,
	SpecialisationSchema,
	BatchSchema,
	GetBatchSchema,
	DeleteBatchSchema,
	AddCourseSchema,
	ClassMaterialPresignSchema,
	AddClassMaterialSchema,
	DeleteClassMaterialSchema,
	GetCourseSchema,
	GetClassMaterialSchema,
	GetClassMaterialScopeSchema,
};
