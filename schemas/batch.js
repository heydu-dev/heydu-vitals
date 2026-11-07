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
	/** 4-axis filter: degree + batch year range. Exact-match strings; degree never maps to a batch GSI,
	 *  so both are post-filtered in memory on each DynamoDB page (page may return fewer than `limit`). */
	degreeID: Joi.string().optional(),
	startYear: Joi.string().optional(),
	endYear: Joi.string().optional(),
	limit: Joi.number().required().max(10),
	/** Query strings are always strings; gateway passes JSON-encoded DynamoDB key */
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.string(),
		Joi.object().unknown(true),
		Joi.allow(null),
	),
});

/**
 * Optional narrowing params shared by the batch-filter dropdown endpoints. Any subset/combination
 * is allowed — each endpoint narrows server-side by whatever filters are currently selected:
 * degrees narrow by department/specialisation, departments by degree/specialisation,
 * specialisations by degree/department, year-options by degree/department/specialisation.
 */
const BatchFilterOptionsSchema = Joi.object({
	degreeID: Joi.string().optional(),
	departmentID: Joi.string().optional(),
	specialisationID: Joi.string().optional(),
}).unknown(true);

/** Permanently delete a batch: students, DynamoDB batch row, and S3 upload. */
const DeleteBatchSchema = Joi.object({
	institutionID: Joi.string().required(),
	excelFileID: Joi.string().required(),
	batchID: Joi.string().required(),
});

/** Presign PUT for uploading more students to an existing batch (same S3 key / excelFileID as initial upload). */
const AdditionalStudentUploadSchema = Joi.object({
	institutionID: Joi.string().required(),
	batchID: Joi.string().required(),
	excelFileID: Joi.string().required(),
	actualExcelFileName: Joi.string().trim().required(),
});

const AddCourseSchema = Joi.object({
	departmentID: Joi.string().required(),
	specialisationID: Joi.string().required(),
	batchID: Joi.string().required(),
	semesterYear: Joi.string().required(),
	tag: Joi.string(),
	name: Joi.string().required(),
});

/**
 * HOD subject setup. `academicYear` is 1-4 and `semester` is 1-2; the legacy
 * `semesterYear` field is derived from `academicYear` by the controller.
 */
const CreateSubjectSchema = Joi.object({
	departmentID: Joi.string().required(),
	specialisationID: Joi.string().required(),
	batchID: Joi.string().required(),
	academicYear: Joi.string().valid('1', '2', '3', '4').required(),
	semester: Joi.string().valid('1', '2').required(),
	code: Joi.string().trim().required(),
	name: Joi.string().trim().required(),
	type: Joi.string().valid('Core', 'Elective', 'Lab', 'Project').default('Core'),
	status: Joi.string().valid('Active', 'Inactive').default('Active'),
	credits: Joi.number().min(0).optional(),
	tag: Joi.string().optional(),
});

/**
 * Only the editable attributes are accepted. The department / specialisation /
 * batch / year / semester context is immutable after creation, so a subject
 * cannot be moved and orphan its materials.
 */
const UpdateSubjectSchema = Joi.object({
	code: Joi.string().trim().optional(),
	name: Joi.string().trim().optional(),
	type: Joi.string().valid('Core', 'Elective', 'Lab', 'Project').optional(),
	status: Joi.string().valid('Active', 'Inactive').optional(),
	credits: Joi.number().min(0).optional(),
})
	.min(1)
	.unknown(false);

const GetSubjectsSchema = Joi.object({
	departmentID: Joi.string().required(),
	specialisationID: Joi.string().allow('').optional(),
	batchID: Joi.string().allow('').optional(),
	academicYear: Joi.string().valid('1', '2', '3', '4').allow('').optional(),
	semester: Joi.string().valid('1', '2').allow('').optional(),
	status: Joi.string().valid('Active', 'Inactive').allow('').optional(),
	type: Joi.string().valid('Core', 'Elective', 'Lab', 'Project').allow('').optional(),
	search: Joi.string().trim().allow('').optional(),
	limit: Joi.number().optional().default(20).min(1).max(50),
	lastEvaluatedKey: Joi.alternatives()
		.try(Joi.string().allow(''), Joi.object().unknown(true), Joi.allow(null))
		.optional(),
});

/** Request presigned PUT URLs before upload — no r2Key yet */
const ClassMaterialPresignSchema = Joi.object({
	uploadedBy: Joi.string().required(),
	materials: Joi.array()
		.items(
			Joi.object({
				name: Joi.string().optional(),
				/** materials | assignments — defaults to `material` for legacy callers */
				kind: Joi.string().valid('material', 'assignment').default('material'),
				title: Joi.string().trim().allow('').optional(),
				description: Joi.string().trim().allow('').optional(),
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
				/** materials | assignments — defaults to `material` for legacy callers */
				kind: Joi.string().valid('material', 'assignment').default('material'),
				title: Joi.string().trim().allow('').optional(),
				description: Joi.string().trim().allow('').optional(),
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
	/** Omit to return both materials and assignments */
	kind: Joi.string().valid('material', 'assignment').optional(),
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
	/** Omit to return both materials and assignments */
	kind: Joi.string().valid('material', 'assignment').optional(),
	limit: Joi.number().required().max(10),
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.string(),
		Joi.object().unknown(true),
		Joi.allow(null),
	),
});

/** Enqueue an async batch → alumni conversion job. Accepts one or more batch IDs. */
const ConvertBatchToAlumniSchema = Joi.object({
	batchIDs: Joi.array().items(Joi.string().required()).min(1).unique().required(),
	institutionID: Joi.string().required(),
	/** Optional student refs (UUIDs or emails) to skip during conversion */
	excludedStudentIDs: Joi.array().items(Joi.string().required()).optional(),
});

/** Enqueue an async batch → alumni revert job. Accepts one or more batch IDs. */
const RevertBatchFromAlumniSchema = Joi.object({
	batchIDs: Joi.array().items(Joi.string().required()).min(1).unique().required(),
	institutionID: Joi.string().required(),
	/** Optional student refs (UUIDs or emails) to keep as alumni during revert */
	excludedStudentIDs: Joi.array().items(Joi.string().required()).optional(),
});

/** Paginated alumni-converted batches (COMPLETED_BATCHES entity) for an institution. */
const GetAlumniConvertedBatchesSchema = Joi.object({
	limit: Joi.number().required().min(1).max(10),
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.string(),
		Joi.object().unknown(true),
		Joi.allow(null),
	),
});

/**
 * Keyset-paginated subjects hierarchy: one page of departments, each fully nested with
 * specialisations → batches → subjects. Only the department list paginates.
 */
const GetSubjectsHierarchySchema = Joi.object({
	/** ID of the last department the client has already seen; omit/empty for the first page */
	cursor: Joi.string().trim().allow('', null).optional(),
	/** Departments per page */
	limit: Joi.number().optional().default(5).min(1).max(25),
});

module.exports = {
	DepartmentSchema,
	BulkDepartmentsSchema,
	SpecialisationSchema,
	BatchSchema,
	GetBatchSchema,
	BatchFilterOptionsSchema,
	DeleteBatchSchema,
	AdditionalStudentUploadSchema,
	AddCourseSchema,
	CreateSubjectSchema,
	UpdateSubjectSchema,
	GetSubjectsSchema,
	ClassMaterialPresignSchema,
	AddClassMaterialSchema,
	DeleteClassMaterialSchema,
	GetCourseSchema,
	GetClassMaterialSchema,
	GetClassMaterialScopeSchema,
	ConvertBatchToAlumniSchema,
	RevertBatchFromAlumniSchema,
	GetAlumniConvertedBatchesSchema,
	GetSubjectsHierarchySchema,
};
