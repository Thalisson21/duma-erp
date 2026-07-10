import { getUserLogs } from 'api/admin';
import AdminResourcePage from '../components/AdminResourcePage';

const columns = [
  { field: 'id', label: 'ID' },
  { field: 'user.name', label: 'Usuário' },
  { field: 'verb', label: 'Ação' },
  { field: 'entity', label: 'Objeto' },
  { field: 'complement', label: 'Descrição' },
  { field: 'created_at', label: 'Criado em' }
];

export default function ActivitiesScreen() {
  return <AdminResourcePage title="Atividades" description="Consulte registros e histórico de atividades administrativas." columns={columns} getData={getUserLogs} />;
}
