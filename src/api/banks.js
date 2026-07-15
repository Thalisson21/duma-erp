export async function getBanks() {
  const response = await fetch('https://brasilapi.com.br/api/banks/v1');
  const data = await response.json();

  if (!response.ok) {
    throw new Error('Não foi possível buscar a lista de bancos.');
  }

  return Array.isArray(data) ? data : [];
}
