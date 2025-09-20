const studentProcessor = require('./students');
const staffProcessor = require('./staff');
const crapProcessor = require('./crap');

const processors = {
	students: studentProcessor,
	staff: staffProcessor,
	crap: crapProcessor,
};

function getProcessorFileByCategory(category) {
	const processor = processors[category];
	if (!processor) {
		throw new Error(`Unknown category: ${category}`);
	}
	return processor;
}

module.exports = { getProcessorFileByCategory };
