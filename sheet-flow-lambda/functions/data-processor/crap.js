const { getRowValues } = require('../utility/excel');

function mapCrapData(rows, columns) {
	return rows.map((row) => {
		const rowObject = getRowValues(row, columns);
		return {
			...rowObject,
		};
	});
}

module.exports = {
	mapCrapData,
};
