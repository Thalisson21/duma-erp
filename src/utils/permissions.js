function normalizePermissionValue(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function getUserPermissionCandidates(user) {
  const account = user?.user || user?.account || user?.profile || user?.perfil || {};

  return [
    user?.role,
    user?.type,
    user?.userType,
    user?.user_type,
    user?.profile,
    user?.perfil,
    user?.permission,
    user?.permissions,
    account?.role,
    account?.type,
    account?.userType,
    account?.user_type,
    account?.profile,
    account?.perfil,
    account?.permission,
    account?.permissions
  ];
}

export function isMasterUser(user) {
  if (user?.is_master || user?.isMaster || user?.master) {
    return true;
  }

  return getUserPermissionCandidates(user).some((candidate) => {
    if (Array.isArray(candidate)) {
      return candidate.some((item) => normalizePermissionValue(item) === 'master');
    }

    if (typeof candidate === 'object' && candidate !== null) {
      return normalizePermissionValue(candidate.name || candidate.title || candidate.role || candidate.type) === 'master';
    }

    return normalizePermissionValue(candidate) === 'master';
  });
}
