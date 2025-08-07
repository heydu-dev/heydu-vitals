const { getRowValues } = require('../utility/excel');

function mapStaffData(row, columns) {
	const rowObject = getRowValues(row, columns);
	return {
		...rowObject,
	};
}

module.exports = {
	mapStaffData,
};
