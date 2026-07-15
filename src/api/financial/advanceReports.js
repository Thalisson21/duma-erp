import { request } from '../httpClient';

export async function getAdvanceReports({ brokerId, page = 1, perPage = 10 } = {}) {
  const params = { page, per_page: perPage };

  if (brokerId) {
    params.broker_id = brokerId;
  }

  return request('advance-reports', {
    method: 'GET',
    params
  });
}
