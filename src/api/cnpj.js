import { onlyNumbers } from 'utils/masks';

export async function getCompanyByCnpj(cnpj) {
  const cleanCnpj = onlyNumbers(cnpj);

  if (cleanCnpj.length !== 14) {
    return null;
  }

  const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'CNPJ não encontrado.');
  }

  return {
    name: data.razao_social || data.nome_fantasia || '',
    email: data.email || '',
    cellphone: data.ddd_telefone_1 || '',
    street: data.logradouro || '',
    number: data.numero || '',
    complement: data.complemento || '',
    district: data.bairro || '',
    city: data.municipio || '',
    state: data.uf || '',
    cep: data.cep || '',
    country: 'BR'
  };
}
