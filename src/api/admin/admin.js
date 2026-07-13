import { request } from '../httpClient';

function getPaginatedResource(path, { page = 1, perPage = 10 } = {}) {
  const [basePath, queryString] = path.split('?');
  const params = new URLSearchParams(queryString || '');

  params.set('page', page);
  params.set('per_page', perPage);

  return request(`${basePath}?${params.toString()}`, {
    method: 'GET'
  });
}

export function getAdminUsers(params) {
  return getPaginatedResource('users?is_active=false', params);
}

export function getBrokerTypes(params) {
  return getPaginatedResource('broker-types', params);
}

export function getComissionTypes(params) {
  return getPaginatedResource('comission-types', params);
}

export function getTransactions(params) {
  return getPaginatedResource('transactions', params);
}

export function getUserLogs(params) {
  return getPaginatedResource('user-logs', params);
}

export function getAdminSupervisors(params) {
  return getPaginatedResource('supervisor', params);
}

export function getProfiles(params) {
  return request('profiles', {
    method: 'GET'
  });
}
