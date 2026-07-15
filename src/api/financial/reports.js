import { request } from '../httpClient';

export async function getReports({ brokerId, page = 1, perPage = 10, isPaid } = {}) {
  const params = { page, per_page: perPage };

  if (brokerId) {
    params.broker_id = brokerId;
  }

  if (isPaid !== undefined) {
    params.is_paid = isPaid;
  }

  return request('reports', {
    method: 'GET',
    params
  });
}
