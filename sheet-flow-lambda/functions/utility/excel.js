const COLUMN_MAP = {
	students: {
		v1: {
			name: { type: 'string', required: true },
			email: { type: 'email', required: true },
			registration: { type: 'string', required: true },
		},
	},
	staff: {
		v1: {
			name: { type: 'string', required: true },
			email: { type: 'email', required: true },
			registration: { type: 'string', required: false },
		},
	},
};

const LATEST_VERSION = {
	students: 'v1',
	staff: 'v1',
	'subject details': 'v1',
	skills: 'v1',
	'job roles': 'v1',
	internships: 'v1',
	'industry programs': 'v1',
	'10 year career growth': 'v1',
	'10 year before change': 'v1',
	certifications: 'v1',
	country: 'v1',
	'personal skills': 'v1',
	'self projects': 'v1',
	'latest technologies': 'v1',
};

const CRAP_CATEGORIES_COLUMN_MAP = {
	'subject details': {
		v1: {
			course: { type: 'string', required: true },
			specialization: { type: 'string', required: true },
			courseName: { type: 'string', required: true },
			importantTopics: { type: 'string', required: true },
		},
	},
	'latest technologies': {
		v1: {
			course: { type: 'string', required: true },
			specialization: { type: 'string', required: true },
			specializationBrief: { type: 'string', required: true },
			technology: { type: 'string', required: true },
			description: { type: 'string', required: true },
			impact: { type: 'string', required: true },
		},
	},
	'self projects': {
		v1: {
			course: { type: 'string', required: true },
			specialization: { type: 'string', required: true },
			projectName: { type: 'string', required: true },
			details: { type: 'string', required: true },
			softwareRequired: { type: 'string', required: true },
			functionalSkills: { type: 'string', required: true },
			plan: { type: 'string', required: true },
			learningOutcomes: { type: 'string', required: true },
			difficultyLevel: { type: 'string', required: true },
		},
	},
	'job roles': {
		v1: {
			course: { type: 'string', required: true },
			specialization: { type: 'string', required: true },
			jobType: { type: 'string', required: true },
			jobRole: { type: 'string', required: true },
			criteria: { type: 'string', required: true },
			skillSet: { type: 'string', required: true },
			industryTrend: { type: 'string', required: true },
		},
	},
	internships: {
		v1: {
			course: { type: 'string', required: true },
			specialization: { type: 'string', required: true },
			jobRole: { type: 'string', required: true },
			internship: { type: 'string', required: true },
			skillSetRequired: { type: 'string', required: true },
			activities: { type: 'string', required: true },
			salaryInr: { type: 'number', required: true },
			learningOutcome: { type: 'string', required: true },
		},
	},
	'industry programs': {
		v1: {
			course: { type: 'string', required: true },
			specialization: { type: 'string', required: true },
			program: { type: 'string', required: true },
			organization: { type: 'string', required: true },
			duration: { type: 'string', required: true },
			eligibility: { type: 'string', required: true },
			description: { type: 'string', required: true },
		},
	},
	'10 year career growth': {
		v1: {
			course: { type: 'string', required: true },
			specialization: { type: 'string', required: true },
			jobRole: { type: 'string', required: true },
			year: { type: 'number', required: true },
			sector: { type: 'string', required: true },
			jobProfile: { type: 'string', required: true },
			salaryRange: { type: 'string', required: true },
			companies: { type: 'string', required: true },
		},
	},
	'10 year before change': {
		v1: {
			course: { type: 'string', required: true },
			specialization: { type: 'string', required: true },
			jobRole: { type: 'string', required: true },
			year: { type: 'number', required: true },
			itServicesConsulting: { type: 'string', required: true },
			healthcare: { type: 'string', required: true },
			finance: { type: 'string', required: true },
			manufacturingRobotics: { type: 'string', required: true },
			retailEcommerce: { type: 'string', required: true },
		},
	},
	skills: {
		v1: {
			course: { type: 'string', required: true },
			specialization: { type: 'string', required: true },
			jobRole: { type: 'string', required: true },
			skill: { type: 'string', required: true },
			skillDetails: { type: 'string', required: true },
		},
	},
	certifications: {
		v1: {
			skill: { type: 'string', required: true },
			level: { type: 'string', required: true },
			courseName: { type: 'string', required: true },
			platform: { type: 'string', required: true },
			duration: { type: 'string', required: true },
			description: { type: 'string', required: true },
			cost: { type: 'string', required: true },
			link: { type: 'string', required: true },
		},
	},
	country: {
		v1: {
			course: { type: 'string', required: true },
			specialization: { type: 'string', required: true },
			country: { type: 'string', required: true },
			jobTrendsForForeigners: { type: 'string', required: true },
			entryCriteriaJobsNoHe: { type: 'string', required: true },
			workVisaRequirements: { type: 'string', required: true },
			salaryAvgAnnual: { type: 'number', required: true },
			higherEduOpportunities: { type: 'string', required: true },
			entryReqHigherEdu: { type: 'string', required: true },
			safetyForIndians: { type: 'string', required: true },
			visaDetailsHigherEdu: { type: 'string', required: true },
			educationLoanDetails: { type: 'string', required: true },
		},
	},
	'personal skills': {
		v1: {
			name: { type: 'string', required: true },
			level: { type: 'string', required: true },
			courseName: { type: 'string', required: true },
			platform: { type: 'string', required: true },
			duration: { type: 'string', required: true },
			description: { type: 'string', required: true },
			cost: { type: 'string', required: true },
			link: { type: 'string', required: true },
		},
	},
};

function getCategoryColumnKeys(
	app,
	category,
	version = LATEST_VERSION[category],
) {
	if (app === 'crap') {
		return Object.keys(CRAP_CATEGORIES_COLUMN_MAP[category][version]) || [];
	}
	if (app === 'heydu') {
		return Object.keys(COLUMN_MAP[category][version]) || [];
	}
	return [];
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
	LATEST_VERSION,
	CRAP_CATEGORIES_COLUMN_MAP,
};
