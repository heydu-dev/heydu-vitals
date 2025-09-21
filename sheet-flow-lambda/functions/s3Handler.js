const xlsx = require('xlsx-parse-stream');
const { getUploadedFileDetails, getFileFromS3 } = require('./utility/s3');
const {
	getCategoryColumnKeys,
	COLUMN_MAP,
	validateRow,
	CRAP_CATEGORIES_COLUMN_MAP,
} = require('./utility/excel');
const { getProcessorFileByCategory } = require('./data-processor/index');

async function processExcelData(
	rows,
	errors,
	category,
	excelFileID,
	app,
	version,
) {
	const rowsWithoutErrors = rows.filter(
		(_row, index) => !errors.some((e) => e.index === index),
	);
	if (rowsWithoutErrors.length === 0) {
		console.log(`No valid rows to process for category: ${category}`);
	}
	if (errors.length) console.log(errors);
	const processor = getProcessorFileByCategory(category);
	if (app === 'heydu') {
		switch (category) {
			case 'students': {
				console.log(`Processing student data`);
				await processor.processStudentData(
					rowsWithoutErrors,
					category,
					errors,
					excelFileID,
					app,
					version,
				);
				break;
			}
			case 'staff': {
				const columnKeys = getCategoryColumnKeys(
					app,
					category,
					version,
				);
				const staffRow = processor.mapStaffData(
					rowsWithoutErrors,
					columnKeys,
				);
				console.log(staffRow);
				break;
			}
			default: {
				console.error(`Unknown category: ${category}`);
			}
		}
	} else if (app === 'crap') {
		await processor.processCrapData(
			rowsWithoutErrors,
			category,
			errors,
			excelFileID,
			app,
			version,
		);
	}
}

module.exports.s3Handler = async (event) => {
	console.log('Received event:', JSON.stringify(event, null, 2));
	const df = [];
	const errors = [];

	let excelFileID = null;
	let category = null;
	let app = null;
	let version = null;

	await Promise.all(
		event.Records.map(async (record) => {
			const {
				bucket,
				key,
				institutionID,
				filename,
				extension,
				category: pathCategory,
				app: appName,
				version: fileVersion,
			} = getUploadedFileDetails(record.s3);
			console.log(`Processing file: ${key} from bucket: ${bucket}`);

			category = pathCategory;
			app = appName;
			version = fileVersion;

			console.log({
				institutionID,
				category,
				filename,
				extension,
				app,
				version,
			});

			const response = await getFileFromS3(bucket, key);
			const stream = response.Body;
			excelFileID = filename.split('.')[0].trim();
			let rowIndex = 0;
			let rules = {};
			if (app === 'heydu') {
				rules = COLUMN_MAP[category][version];
			} else if (app === 'crap') {
				rules = CRAP_CATEGORIES_COLUMN_MAP[category][version];
			}
			await new Promise((resolve, reject) => {
				stream
					.pipe(xlsx())
					.on('data', (row) => {
						rowIndex += 1;
						df.push(row);
						const error = validateRow(row, rules, rowIndex);
						if (error) {
							errors.push({ index: rowIndex - 1, error });
						}
						console.log(`df:`, df);
					})
					.on('end', () => {
						console.log(`Finished parsing ${key}`);

						resolve();
					})
					.on('error', async (err) => {
						console.error(`Error processing file:`, err);
						reject(err);
					});
			});
		}),
	);
	try {
		await processExcelData(df, errors, category, excelFileID, app, version);
	} catch (err) {
		console.error(`Error processing Excel data:`, err);
		return {
			statusCode: 500,
			body: `Error processing file: ${err.message}`,
		};
	}

	return {
		statusCode: 200,
		body: 'Successfully processed XLSX file.',
	};
};
