import { getComissionTypes } from 'api/admin';
import AdminResourcePage from '../components/AdminResourcePage';

const columns = [
  { field: 'broker_type.description', label: 'Tipo de Corretor' },
  { field: 'plan.description', label: 'Plano' },
  { field: 'installments.length', label: 'Parcelas' },
];

export default function ComissionTypesScreen() {
  return <AdminResourcePage title="Grade de comissão" description="Defina grades, faixas e políticas de comissionamento." columns={columns} getData={getComissionTypes} />;
}
