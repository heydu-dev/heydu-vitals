const xlsx = require('xlsx-parse-stream');
const { batchAction } = require('data-wolf');
const { getUploadedFileDetails, getFileFromS3 } = require('./utility/s3');
const {
	getCategoryColumnKeys,
	COLUMN_MAP,
	validateRow,
} = require('./utility/excel');
const { getProcessorFileByCategory } = require('./data-processor/index');

async function processExcelData(row, index, category, excelFileID) {
	const columnKeys = getCategoryColumnKeys(category);
	const errors = validateRow(row, COLUMN_MAP[category], index);
	if (errors) console.log(errors);
	const processor = getProcessorFileByCategory(category);
	switch (category) {
		case 'students': {
			const studentRow = await processor.mapStudentData(
				row,
				columnKeys,
				excelFileID,
			);
			await processor.processStudentData(
				studentRow,
				index,
				errors,
				excelFileID,
			);
			break;
		}
		case 'staff': {
			const staffRow = processor.mapStaffData(row, columnKeys);
			console.log(staffRow);
			break;
		}
		case 'crap': {
			const crapRow = processor.mapCrapData(row, columnKeys);
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

	await Promise.all(
		event.Records.map(async (record) => {
			const {
				bucket,
				key,
				institutionID,
				filename,
				extension,
				category,
			} = getUploadedFileDetails(record.s3);
			console.log(`Processing file: ${key} from bucket: ${bucket}`);

			console.log({
				institutionID,
				category,
				filename,
				extension,
			});

			const response = await getFileFromS3(bucket, key);
			const stream = response.Body;
			const excelFileID = filename.split('.')[0];
			let rowIndex = 0;
			await new Promise((resolve, reject) => {
				stream
					.pipe(xlsx())
					.on('data', (row) => {
						rowIndex += 1;
						processExcelData(row, rowIndex, category, excelFileID);
					})
					.on('end', () => {
						console.log(`Finished parsing ${key}`);
						resolve();
					})
					.on('error', async (err) => {
						try {
							await batchAction.updateBatchDataByExcelFileID({
								excelFileID: filename.split('.')[0],
								excelUploadStatusMessage: err.message,
							});
						} catch (dbErr) {
							console.error('Failed to log error to DB:', dbErr);
						}
						reject(err);
					});
			});
		}),
	);

	return {
		statusCode: 200,
		body: 'Successfully processed XLSX file.',
	};
};
