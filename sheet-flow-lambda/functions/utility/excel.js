const COLUMN_MAP = {
	students: {
		name: { type: 'string', required: true },
		email: { type: 'email', required: true },
		registration: { type: 'string', required: true },
	},
	staff: {
		name: { type: 'string', required: true },
		email: { type: 'email', required: true },
		registration: { type: 'string', required: false },
	},
	crap: {},
};

function getCategoryColumnKeys(category) {
	return Object.keys(COLUMN_MAP[category]) || [];
}

function validateRow(row, rules, index) {
	const errors = [];

	Object.entries(rules).forEach(([column, rule]) => {
		const value = row[column];
		const isEmpty = value === undefined || value === null || value === '';

		// Handle required fields
		if (rule.required && isEmpty) {
			errors.push(`Row ${index}: ${column} is required`);
			return;
		}

		// Skip optional empty fields
		if (!rule.required && isEmpty) {
			return;
		}

		// Type validation
		switch (rule.type) {
			case 'string':
				if (typeof value !== 'string') {
					errors.push(`Row ${index}: ${column} should be a string`);
				}
				break;

			case 'email':
				if (
					typeof value !== 'string' ||
					!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
				) {
					errors.push(
						`Row ${index}: ${column} should be a valid email`,
					);
				}
				break;

			case 'number':
				if (Number.isNaN(Number(value))) {
					errors.push(`Row ${index}: ${column} should be a number`);
				}
				break;

			case 'year':
				if (!/^\d{4}$/.test(String(value))) {
					errors.push(
						`Row ${index}: ${column} should be a valid year (YYYY)`,
					);
				}
				break;

			default:
				// Allow custom extension later
				break;
		}
	});

	return errors.length ? errors : null;
}

function getRowValues(row, columnKeys) {
	const rowDict = {};
	columnKeys.forEach((col) => {
		rowDict[col] = row[col];
		console.log(`Processing column: ${col}`, `Value: ${row[col]}`);
	});
	return rowDict;
}

module.exports = {
	getCategoryColumnKeys,
	COLUMN_MAP,
	validateRow,
	getRowValues,
};
