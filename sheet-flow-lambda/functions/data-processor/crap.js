const { crapAction } = require('data-wolf');
const { getRowValues, getCategoryColumnKeys } = require('../utility/excel');

function mapCrapData(rows, columns) {
	return rows.map((row) => {
		const rowObject = getRowValues(row, columns);
		return {
			...rowObject,
		};
	});
}

async function processCrapData(
	rows,
	category,
	errors,
	excelFileID,
	app,
	version,
) {
	try {
		const columnKeys = getCategoryColumnKeys(app, category, version);

		const crapRows = await mapCrapData(rows, columnKeys);

		console.log(`Mapped crap rows:`, crapRows);
		let res = [];
		switch (category) {
			case 'internships': {
				res = await crapAction.addBulkInternship(crapRows);
				break;
			}
			case 'industry programs': {
				res = await crapAction.addBulkIndustryProgram(crapRows);
				break;
			}
			case '10 year career growth': {
				res = await crapAction.addBulkCareerGrowth(crapRows);
				break;
			}
			case '10 year before change': {
				res = await crapAction.addBulkBeforeChange(crapRows);
				break;
			}
			case 'skills': {
				res = await crapAction.addBulkSkill(crapRows);
				break;
			}
			case 'certifications': {
				res = await crapAction.addBulkCertification(crapRows);
				break;
			}
			case 'country': {
				res = await crapAction.addBulkCountry(crapRows);
				break;
			}
			case 'personal skills': {
				res = await crapAction.addBulkPersonalSkill(crapRows);
				break;
			}
			case 'self projects': {
				res = await crapAction.addBulkSelfProject(crapRows);
				break;
			}
			case 'latest technologies': {
				res = await crapAction.addBulkLatestTechnology(crapRows);
				break;
			}
			case 'subject details': {
				res = await crapAction.addBulkSubjectDetails(crapRows);
				break;
			}
			case 'job roles': {
				res = await crapAction.addBulkJobRole(crapRows);
				break;
			}
			default: {
				throw new Error(`Unknown category: ${category}`);
			}
		}
		// TODO: check unprocessed rows and write to errors
		console.log(
			`Added ${res.length} crap successfully.`,
			JSON.stringify(res, null, 2),
		);
	} catch (error) {
		console.error(`Error processing crap data:`, error);
		errors.push({
			error: `Error processing item for ${excelFileID}: ${error.message}`,
		});
	}
}

module.exports = {
	mapCrapData,
	processCrapData,
};
