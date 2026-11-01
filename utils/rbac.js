const { utilityAction, userAction } = require('data-wolf');
const { PERMISSIONS, PERMISSION_KEYS } = require('./permission-catalog');

const DEFAULT_SELF_SERVICE_PERMISSIONS = [
	'batch.read',
	'materials.read',
	'departments.read',
	'specialisations.read',
	'utility.lookup.read',
	'posts.read',
	'posts.manage',
	'comments.read',
	'comments.manage',
	'users.notifications.read',
	'users.notifications.manage',
	'users.followers.read',
	'users.followers.manage',
	'users.media.manage',
	'users.profile.self.manage',
	'users.profiles.read',
	'users.scores.self.read',
	'users.scores.self.manage',
	'crap.dashboard.read',
	'crap.reports.own.read',
	'crap.forms.manage',
	'crap.progress.manage',
	'crap.self_service',
	'crap.cv.read',
	'crap.cv.manage',
];

function uniqueStrings(values) {
	return [...new Set((Array.isArray(values) ? values : []).filter((value) => typeof value === 'string' && value))];
}

async function getPermissionCatalog() {
	const stored = await utilityAction.getAllPermissions();
	const byKey = new Map(PERMISSIONS.map((permission) => [permission.key, permission]));
	for (const permission of stored) {
		if (permission && permission.key) {
			byKey.set(permission.key, {
				...(byKey.get(permission.key) || {}),
				...permission,
				isSystem: PERMISSION_KEYS.has(permission.key),
			});
		}
	}
	return [...byKey.values()].sort((left, right) =>
		`${left.category || 'Custom'}:${left.name}`.localeCompare(`${right.category || 'Custom'}:${right.name}`),
	);
}

async function getEffectivePermissions(profile) {
	if (!profile) return [];
	const roleIDs = uniqueStrings(profile.roleIDs);
	// Existing Heydu admins predate RBAC. Keep them as owners until an explicit
	// role assignment is made; assigned admins are restricted to their roles.
	if (Number(profile.profileTypeID) === 4 && roleIDs.length === 0) {
		return (await getPermissionCatalog())
			.filter((permission) => permission.active !== false)
			.map((permission) => permission.key);
	}
	if (!roleIDs.length) {
		return Number(profile.profileTypeID) === 4 ? [] : DEFAULT_SELF_SERVICE_PERMISSIONS;
	}

	const roles = await Promise.all(roleIDs.map((id) => utilityAction.getRoleByID(id)));
	const catalog = await getPermissionCatalog();
	const activeKeys = new Set(catalog.filter((permission) => permission.active !== false).map((permission) => permission.key));
	const rolePermissions = uniqueStrings(
		roles
			.filter((role) => role && role.active !== false)
			.flatMap((role) => (Array.isArray(role.permissions) ? role.permissions : [])),
	).filter((permissionKey) => activeKeys.has(permissionKey));
	return rolePermissions;
}

function requirePermission(requiredPermission) {
	return async (req, res, next) => {
		try {
			const profile = req.user && req.user.profile;
			if (!profile) {
				return res.status(401).json({
					success: false,
					status: 401,
					code: 'AUTHENTICATION_REQUIRED',
					message: 'Authentication is required to access this resource.',
				});
			}
			const permissions = await getEffectivePermissions(profile);
			const allowed = (Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission])
				.some((permission) => permissions.includes(permission));
			if (!allowed) {
				return res.status(403).json({
					success: false,
					status: 403,
					code: 'FORBIDDEN',
					message: 'You do not have permission to perform this action.',
				});
			}
			req.user.permissions = permissions;
			return next();
		} catch (error) {
			return next(error);
		}
	};
}

async function hasActiveRoleManager({ roleOverrides = {}, adminOverrides = {} } = {}) {
	const [roles, admins] = await Promise.all([
		utilityAction.getAllRoles(),
		userAction.getAllAdmins(),
	]);
	const roleByID = new Map(roles.map((role) => {
		const override = roleOverrides[role.id] || {};
		return [String(role.id), { ...role, ...override }];
	}));
	return (Array.isArray(admins) ? admins : []).some((admin) => {
		const override = adminOverrides[String(admin.id)] || {};
		if (override.deleted) return false;
		const roleIDs = uniqueStrings(override.roleIDs === undefined ? admin.roleIDs : override.roleIDs);
		// An unassigned administrator is the compatibility owner role and keeps
		// the system recoverable while the initial admins are migrated.
		if (roleIDs.length === 0) return true;
		return roleIDs.some((roleID) => {
			const role = roleByID.get(String(roleID));
		return role && role.active !== false && Array.isArray(role.permissions)
				&& role.permissions.includes('roles.manage')
				&& role.permissions.includes('users.assign_roles');
		});
	});
}

module.exports = { getPermissionCatalog, getEffectivePermissions, requirePermission, hasActiveRoleManager };
