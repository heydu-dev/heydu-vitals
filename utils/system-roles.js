const SYSTEM_ROLE_IDS = Object.freeze({
	heyduAdmin: '8a318521-44d5-4bb3-b189-f76d7322dc82',
	collegeAdmin: '3c68e235-727e-49bd-9a30-c98e4cb172de',
});

const COLLEGE_ADMIN_PERMISSIONS = Object.freeze([
	'users.assign_roles',
	'users.staff.read',
	'users.staff.manage',
	'users.students.read',
	'users.students.manage',
	'users.alumni.manage',
	'users.institutions.manage',
	'batch.read',
	'batch.manage',
	'materials.read',
	'materials.manage',
	'departments.read',
	'departments.manage',
	'specialisations.read',
	'specialisations.manage',
]);

const SYSTEM_ROLE_DEFINITIONS = Object.freeze([
	{
		id: SYSTEM_ROLE_IDS.heyduAdmin,
		key: 'heydu_admin',
		name: 'Heydu Admin',
		description: 'Full access to all Heydu APIs and access control.',
		scope: 'global',
	},
	{
		id: SYSTEM_ROLE_IDS.collegeAdmin,
		key: 'college_admin',
		name: 'College Admin',
		description: 'Manage users and academic data for the assigned college.',
		scope: 'institution',
		permissions: COLLEGE_ADMIN_PERMISSIONS,
	},
]);

module.exports = {
	SYSTEM_ROLE_IDS,
	SYSTEM_ROLE_DEFINITIONS,
	COLLEGE_ADMIN_PERMISSIONS,
};
