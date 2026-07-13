import {request} from '../httpClient';
import {onlyNumbers} from 'utils/masks';

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

export async function getBrokers({page = 1, perPage = 10, search = '', searchType = 'name'} = {}) {
  const params = {
    page,
    per_page: perPage
  };

  const searchValue = getSearchValue(search, searchType);
  const searchParam = searchParamsByType[searchType];

  if (searchParam && searchValue) {
    params[searchParam] = searchValue;
  }

  return request('broker', {
    method: 'GET',
    params
  });
}

export async function createBroker(broker) {
  return request('broker', {
    method: 'POST',
    data: broker
  });
}

export async function updateBroker(brokerId, broker) {
  return request(`broker/${brokerId}`, {
    method: 'PUT',
    data: broker
  });
}

export async function viewBroker(brokerId) {
  return request(`broker/${brokerId}`, {
    method: 'GET'
  });
}

export async function getBrokerAvatar(avatarId) {
  return request(`broker-avatar/${avatarId}`, {
    method: 'GET',
    responseType: 'blob'
  });
}

export async function getBrokerTypes() {
  return request('broker-types/all', { method: 'GET' });
}
