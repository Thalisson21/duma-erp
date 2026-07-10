import { request } from './httpClient';
import { onlyNumbers } from 'utils/masks';

const searchParamsByType = {
  name: 'name',
  cpf_or_cnpj: 'cpf_or_cnpj'
};

function getSearchValue(search, searchType) {
  if (searchType === 'cpf_or_cnpj') {
    return onlyNumbers(search);
  }

  return search.trim();
}

export async function getClients({ page = 1, perPage = 10, search = '', searchType = 'name' } = {}) {
  const params = {
    page,
    per_page: perPage
  };

  const searchValue = getSearchValue(search, searchType);
  const searchParam = searchParamsByType[searchType];

  if (searchParam && searchValue) {
    params[searchParam] = searchValue;
  }

  return request('clients', {
    method: 'GET',
    params
  });
}

export async function createClient(client) {
  return request('clients', {
    method: 'POST',
    data: client
  });
}

export async function updateClient(clientId, client) {
  return request(`clients/${clientId}`, {
    method: 'PUT',
    data: client
  });
}
