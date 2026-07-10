import { getTransactions } from 'api/admin';
import AdminResourcePage from '../components/AdminResourcePage';

function formatTransactionType(value) {
  const transactionTypes = {
    INCOMING: 'CRÉDITO',
    OUTCOMING: 'DÉBITO'
  };

  return transactionTypes[value] || value || '-';
}

const columns = [
  { field: 'id', label: 'ID' },
  { field: 'description', label: 'Descrição' },
  { field: 'transaction_type', label: 'Tipo de Transação', format: formatTransactionType },
  { field: 'current_balance', label: 'Saldo atual' },
  { field: 'created_at', label: 'Criado em' }
];

export default function TransactionsScreen() {
  return <AdminResourcePage title="Transações" description="Transações realizadas na carteira do corretor" columns={columns} getData={getTransactions} />;
}
