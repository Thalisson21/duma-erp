import { onlyNumbers } from 'utils/masks';

export async function getAddressByCep(cep) {
  const cleanCep = onlyNumbers(cep);

  if (cleanCep.length !== 8) {
    return null;
  }

  const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
  const data = await response.json();

  if (!response.ok || data.erro) {
    throw new Error('CEP não encontrado.');
  }

  return {
    street: data.logradouro || '',
    district: data.bairro || '',
    city: data.localidade || '',
    state: data.uf || '',
    country: 'BR'
  };
}
