const { batchAction, userAction } = require('data-wolf');
const { v4: uuidv4 } = require('uuid');
const { getRowValues, getCategoryColumnKeys } = require('../utility/excel');

async function getBatchByExcelId(excelId) {
	try {
		if (!excelId) {
			throw new Error('Excel ID is required');
		}
		const Items = await batchAction.getBatchDataByExcelFileID(excelId);
		console.log(`Fetched batch data for Excel ID ${excelId}:`, Items);
		return Items[0] || null;
	} catch (error) {
		console.error(
			`Error fetching batch data for Excel ID ${excelId}:`,
			error,
		);
		throw error;
	}
}

function mapStudentData(rows, columns, batchData) {
	return rows.map((row) => {
		// Get row values based on the provided columns
		// This will return an object with keys as column names and values as row values
		const rowObject = getRowValues(row, columns);
		return {
			id: uuidv4(),
			institutionID: batchData.institutionID,
			departmentID: batchData.departmentID,
			startYear: batchData.startYear,
			finalYear: batchData.endYear,
			degreeID: batchData.degreeID,
			batchID: batchData.id,
			registrationNumber: rowObject.registration,
			profileTypeID: 3,
			specialisationID: batchData.specialisationID,
			...rowObject,
		};
	});
}

async function processStudentData(rows, category, errors, excelFileID) {
	let status = 'success';
	let batchID = null;
	try {
		const batchData = await getBatchByExcelId(excelFileID);
		const columnKeys = getCategoryColumnKeys(category);
		batchID = batchData.id;
		console.log(`Batch data for Excel ID ${excelFileID}:`, batchData);
		const studentRows = await mapStudentData(rows, columnKeys, batchData);

		console.log(`Mapped student rows:`, studentRows);
		const res = await userAction.addStudentsBulk(studentRows);
		// TODO: check unprocessed rows and write to errors
		console.log(
			`Added ${res.length} students successfully.`,
			JSON.stringify(res, null, 2),
		);
	} catch (error) {
		console.error(`Error processing student data:`, error);
		errors.push({ error: `Error processing item: ${error.message}` });
	} finally {
		if (errors.length > 0) {
			status = `Errors: ${errors.reduce(
				(acc, item) => `${acc}${item.error} `,
				'',
			)}`;
		}
		// Update the batch data with the status
		await batchAction.updateBatchDataByExcelFileID({
			id: batchID,
			excelFileID,
			excelUploadStatusMessage: status,
		});
	}
}

module.exports = {
	processStudentData,
	mapStudentData,
	getBatchByExcelId,
};
