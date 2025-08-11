const { batchAction, userAction } = require('data-wolf');
const { getRowValues } = require('../utility/excel');

async function processStudentData(rows, errors, excelFileID) {
	let status = 'success';
	try {
		// TODO: Do I need to Add student id or will it be auto generated?
		const res = await userAction.addStudentsBulk(rows);
		console.log(
			`Added ${res.length} students successfully.`,
			JSON.stringify(res, null, 2),
		);
	} catch (error) {
		errors.push(`Error processing item: ${error.message}`);
	} finally {
		if (errors.length > 0) {
			status = `Error: ${errors.join(', ')}`;
		}
		// Update the batch data with the status

		// TODO: is the update object correct?
		await batchAction.updateBatchDataByExcelFileID({
			excelFileID,
			excelUploadStatusMessage: status,
		});
	}
}

async function getBatchByExcelId(excelId) {
	try {
		if (!excelId) {
			throw new Error('Excel ID is required');
		}
		// TODO: id is required, but this function does not have access to the batch id.
		// Does this be provided in excel?
		const Items = await batchAction.getBatchDataByExcelFileID(excelId);
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
			institutionID: batchData.institutionID,
			departmentID: batchData.departmentID,
			specializationID: batchData.specializationID,
			startYear: batchData.startYear,
			finalYear: batchData.endYear,
			degreeID: batchData.degreeID,
			batchID: batchData.id,
			registrationNumber: rowObject.registration,
			profileTypeID: 3,
			...rowObject,
		};
	});
}

module.exports = {
	processStudentData,
	mapStudentData,
	getBatchByExcelId,
};
