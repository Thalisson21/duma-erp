import axiosServices from 'utils/axios';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function request(path, options = {}) {
  const { body, ...axiosOptions } = options;

  try {
    const response = await axiosServices.request({
      url: path,
      data: body,
      ...axiosOptions
    });

    return response.data;
  } catch (error) {
    const data = error.response?.data;
    const status = error.response?.status;

    throw new ApiError(data?.message || 'Nao foi possivel completar a solicitacao.', status, data);
  }
}
