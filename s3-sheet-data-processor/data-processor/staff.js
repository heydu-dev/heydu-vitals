const { getRowValues } = require('../utility/excel');

function mapStaffData(rows, columns) {
	return rows.map((row) => {
		const rowObject = getRowValues(row, columns);
		return {
			...rowObject,
		};
	});
}

module.exports = {
	mapStaffData,
};
