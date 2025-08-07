const { getRowValues } = require('../utility/excel');

function mapCrapData(row, columns) {
	const rowObject = getRowValues(row, columns);
	return {
		...rowObject,
	};
}

module.exports = {
	mapCrapData,
};
