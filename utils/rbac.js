const { utilityAction, userAction } = require('data-wolf');
const { PERMISSIONS, PERMISSION_KEYS } = require('./permission-catalog');
const { SYSTEM_ROLE_DEFINITIONS } = require('./system-roles');

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
	profile.effectiveRoleScopes = [];
	// Assigned UUID role IDs are authoritative for every profile type, including
	// staff moderators; role resolution uses the UUID key only.
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
	const activeRoles = roles.filter((role) => role && role.active !== false);
	profile.effectiveRoleScopes = uniqueStrings(activeRoles.map((role) => role.scope));
	const catalog = await getPermissionCatalog();
	const activeKeys = new Set(catalog.filter((permission) => permission.active !== false).map((permission) => permission.key));
	if (activeRoles.some((role) => role.key === 'heydu_admin')) {
		return catalog.filter((permission) => permission.active !== false).map((permission) => permission.key);
	}
	const rolePermissions = uniqueStrings(
		activeRoles.flatMap((role) => (Array.isArray(role.permissions) ? role.permissions : [])),
	).filter((permissionKey) => activeKeys.has(permissionKey));
	return rolePermissions;
}

function requireInstitutionScope(resolveInstitutionIDs) {
	return async (req, res, next) => {
		try {
			const profile = req.user && req.user.profile;
			const scopes = uniqueStrings(profile && profile.effectiveRoleScopes);
			if (!scopes.includes('institution') || scopes.includes('global')) return next();

			const ownInstitutionID = profile && profile.institutionID;
			if (!ownInstitutionID) {
				return res.status(403).json({
					success: false,
					status: 403,
					code: 'FORBIDDEN',
					message: 'Your College Admin role is not linked to a college.',
				});
			}

			const explicitInstitutionIDs = [
				req.params && req.params.institutionID,
				req.body && req.body.institutionID,
				req.query && req.query.institutionID,
				...((req.body && Array.isArray(req.body.materials))
					? req.body.materials.map((material) => material && material.institutionID)
					: []),
			];
			const resolved = typeof resolveInstitutionIDs === 'function'
				? await resolveInstitutionIDs(req)
				: [];
			const institutionIDs = uniqueStrings([
				...explicitInstitutionIDs,
				...(Array.isArray(resolved) ? resolved : [resolved]),
			]);
			if (!institutionIDs.length || institutionIDs.some((id) => String(id) !== String(ownInstitutionID))) {
				return res.status(403).json({
					success: false,
					status: 403,
					code: 'FORBIDDEN',
					message: 'College Admins can only access data for their assigned college.',
				});
			}
			return next();
		} catch (error) {
			return next(error);
		}
	};
}

async function ensureSystemRoles() {
	const [roles, catalog] = await Promise.all([
		utilityAction.getAllRoles(),
		getPermissionCatalog(),
	]);
	const activePermissionKeys = catalog
		.filter((permission) => permission.active !== false)
		.map((permission) => permission.key);
	const activePermissionSet = new Set(activePermissionKeys);
	const now = new Date().toISOString();

	for (const definition of SYSTEM_ROLE_DEFINITIONS) {
		const permissions = definition.key === 'heydu_admin'
			? activePermissionKeys
			: definition.permissions.filter((permission) => activePermissionSet.has(permission));
		const existing = roles.find((role) =>
			role.key === definition.key
			|| String(role.name || '').trim().toLowerCase() === definition.name.toLowerCase()
		);
		const fixedIDCollision = roles.find((role) => String(role.id) === definition.id);
		if (!existing && fixedIDCollision) {
			throw new Error(`Cannot provision system role ${definition.key}: its fixed UUID is already in use`);
		}
		const roleDetails = {
			key: definition.key,
			scope: definition.scope,
			name: definition.name,
			description: definition.description,
			permissions,
			active: true,
			isSystem: true,
			updatedAt: now,
			updatedBy: 'system',
		};

		if (!existing) {
			await utilityAction.addRoleDetails({
				...roleDetails,
				id: definition.id,
				createdAt: now,
				createdBy: 'system',
			});
			continue;
		}

		const unchanged = existing.key === roleDetails.key
			&& existing.scope === roleDetails.scope
			&& existing.name === roleDetails.name
			&& existing.description === roleDetails.description
			&& existing.active !== false
			&& existing.isSystem === true
			&& JSON.stringify(existing.permissions || []) === JSON.stringify(permissions);
		if (!unchanged) {
			await utilityAction.updateRoleDetails(existing.id, roleDetails);
		}
	}

	return utilityAction.getAllRoles();
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

module.exports = {
	getPermissionCatalog,
	getEffectivePermissions,
	requirePermission,
	requireInstitutionScope,
	ensureSystemRoles,
	hasActiveRoleManager,
};
