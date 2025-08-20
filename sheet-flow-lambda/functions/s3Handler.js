const xlsx = require('xlsx-parse-stream');
const { getUploadedFileDetails, getFileFromS3 } = require('./utility/s3');
const {
	getCategoryColumnKeys,
	COLUMN_MAP,
	validateRow,
} = require('./utility/excel');
const { getProcessorFileByCategory } = require('./data-processor/index');

async function processExcelData(rows, errors, category, excelFileID) {
	const rowsWithoutErrors = rows.filter(
		(_row, index) => !errors.some((e) => e.index === index),
	);
	if (rowsWithoutErrors.length === 0) {
		console.log(`No valid rows to process for category: ${category}`);
	}
	if (errors.length) console.log(errors);
	const processor = getProcessorFileByCategory(category);
	switch (category) {
		case 'students': {
			console.log(`Processing student data`);
			await processor.processStudentData(
				rowsWithoutErrors,
				category,
				errors,
				excelFileID,
			);
			break;
		}
		case 'staff': {
			const columnKeys = getCategoryColumnKeys(category);
			const staffRow = processor.mapStaffData(
				rowsWithoutErrors,
				columnKeys,
			);
			console.log(staffRow);
			break;
		}
		case 'crap': {
			const columnKeys = getCategoryColumnKeys(category);
			const crapRow = processor.mapCrapData(
				rowsWithoutErrors,
				columnKeys,
			);
			console.log(crapRow);
			break;
		}
		default: {
			console.error(`Unknown category: ${category}`);
		}
	}
}

module.exports.s3Handler = async (event) => {
	console.log('Received event:', JSON.stringify(event, null, 2));
	const df = [];
	const errors = [];

	let excelFileID = null;
	let category = null;

	await Promise.all(
		event.Records.map(async (record) => {
			const {
				bucket,
				key,
				institutionID,
				filename,
				extension,
				category: pathCategory,
			} = getUploadedFileDetails(record.s3);
			console.log(`Processing file: ${key} from bucket: ${bucket}`);

			category = pathCategory;

			console.log({
				institutionID,
				category,
				filename,
				extension,
			});

			const response = await getFileFromS3(bucket, key);
			const stream = response.Body;
			excelFileID = filename.split('.')[0].trim();
			let rowIndex = 0;

			await new Promise((resolve, reject) => {
				stream
					.pipe(xlsx())
					.on('data', (row) => {
						rowIndex += 1;
						df.push(row);
						const error = validateRow(
							row,
							COLUMN_MAP[category],
							rowIndex,
						);
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
		await processExcelData(df, errors, category, excelFileID);
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
