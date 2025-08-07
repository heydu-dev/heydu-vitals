const { batchAction, userAction } = require('data-wolf');
const { getRowValues } = require('../utility/excel');

async function processStudentData(row, index, errors, excelFileID) {
	const obj = row;
	let status = 'success';
	try {
		// TODO: Do I need to Add student id or will it be auto generated?
		// TODO: what about the profile type id. do I need to add it?
		await userAction.addStudentDetails(obj);
	} catch (error) {
		console.error(`Error processing item at index ${index}:`, error);
		errors.push(`Error in Processing: Row ${index + 1}: ${error.message}`);
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
		return await batchAction.getBatchDataByExcelFileID(excelId);
	} catch (error) {
		console.error(
			`Error fetching batch data for Excel ID ${excelId}:`,
			error,
		);
		throw error;
	}
}

async function mapStudentData(row, columns, excelFileID) {
	const rowObject = getRowValues(row, columns);
	const batchData = await getBatchByExcelId(excelFileID);
	return {
		institutionID: batchData.institutionID,
		departmentID: batchData.departmentID,
		specializationID: batchData.specializationID,
		startYear: batchData.startYear,
		finalYear: batchData.endYear,
		degreeID: batchData.degreeID,
		batchID: batchData.id,
		registrationNumber: rowObject.registration,
		...rowObject,
	};
}

module.exports = {
	processStudentData,
	mapStudentData,
};
