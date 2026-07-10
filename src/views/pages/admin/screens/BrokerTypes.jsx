import { getBrokerTypes } from 'api/admin';
import AdminResourcePage from '../components/AdminResourcePage';

const columns = [
  { field: 'id', label: 'ID' },
  { field: 'description', label: 'Descrição' },
  { field: 'created_at', label: 'Data de Criação' }
];

export default function BrokerTypesScreen() {
  return <AdminResourcePage title="Tipo de Corretor" description="Configure categorias e regras aplicadas aos corretores." columns={columns} getData={getBrokerTypes} />;
}
