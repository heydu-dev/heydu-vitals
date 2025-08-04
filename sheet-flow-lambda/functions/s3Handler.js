const path = require('path');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const xlsx = require('xlsx-parse-stream');
const { batchAction, userAction } = require('data-wolf');

const s3 = new S3Client({ region: 'ap-south-1' });

const COLUMN_MAP = {
	students: ['First Name', 'Last Name', 'Date'],
	institutions: ['name', 'email', 'address', 'phone'],
	staff: [
		'name',
		'email',
		'institutionID',
		'departmentID',
		'specializationID',
	],
};

function getColumnKeysFromPath(category) {
	return COLUMN_MAP[category] || [];
}

async function getBatchByExcelId(excelId) {
	try {
		if (!excelId) {
			throw new Error('Excel ID is required');
		}
		// Assuming batchAction.getBatchDataByExcelFileID is a function that fetches batch data by Excel ID
		return await batchAction.getBatchDataByExcelFileID(excelId);
	} catch (error) {
		console.error(
			`Error fetching batch data for Excel ID ${excelId}:`,
			error,
		);
		throw error;
	}
}

module.exports.s3Handler = async (event) => {
	console.log('Received event:', JSON.stringify(event, null, 2));

	await Promise.all(
		event.Records.map(async (record) => {
			const bucket = record.s3.bucket.name;
			const key = decodeURIComponent(
				record.s3.object.key.replace(/\+/g, ' '),
			);
			console.log(`Processing file: ${key} from bucket: ${bucket}`);

			// Parse folder structure instead of complex regex
			const parts = key.split('/');
			const institutionFolder = parts[2];
			const category = parts[3];
			const filename = parts[4];
			const extension = path.extname(filename).slice(1);

			const batchData = await getBatchByExcelId(filename.split('.')[0]);

			// Institution ID and optional name
			let institutionID = institutionFolder;
			let institutionName = null;
			const nameStartIndex = institutionFolder.indexOf('(');
			if (nameStartIndex > -1) {
				institutionID = institutionFolder
					.substring(0, nameStartIndex)
					.trim();
				institutionName = institutionFolder.substring(
					nameStartIndex + 1,
					institutionFolder.length - 1,
				);
			}

			console.log({
				institutionID,
				institutionName,
				category,
				filename,
				extension,
			});

			const columnKeys = getColumnKeysFromPath(category);
			const result = [];

			const command = new GetObjectCommand({ Bucket: bucket, Key: key });
			const response = await s3.send(command);
			const stream = response.Body;

			await new Promise((resolve, reject) => {
				stream
					.pipe(xlsx())
					.on('data', (row) => {
						const rowDict = {
							institutionID: batchData.institutionID,
							departmentID: batchData.departmentID,
							specializationID: batchData.specializationID,
							startYear: batchData.startYear,
							finalYear: batchData.endYear,
							degreeID: batchData.degreeID,
							batchID: batchData.id,
						};
						columnKeys.forEach((col) => {
							rowDict[col] = row[col] || '';
							console.log(
								`Processing column: ${col}`,
								`Value: ${row[col]}`,
							);
						});
						result.push(rowDict);
					})
					.on('end', () => {
						console.log(`Finished parsing ${key}`);
						console.log(result);
						result.forEach(async (item, index) => {
							// get student by email -- this would be based on category. if student, then get by email.
							// if institution, then get by institution id. if staff, then get by email.
							const obj = item;
							try {
								const user = await userAction.getByEmail(
									obj.email,
								);
								if (user.length > 0) {
									obj.registrationNumber =
										user[0].registrationNumber;
								}
								// add user obj in db. same here
								await userAction.addStudentDetails(obj);
							} catch (error) {
								console.error(
									`Error processing item at index ${index}:`,
									error,
								);
								await batchAction.updateBatchDataByExcelFileID({
									excelFileID: filename.split('.')[0],
									excelUploadStatusMessage: `${error.message} for row ${index + 1}`,
								});
							}
						});
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
