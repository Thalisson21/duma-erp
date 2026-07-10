import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import MasterRoute from './MasterRoute';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// clients routing
const ClientsPage = Loadable(lazy(() => import('views/pages/register/clients')));
const BrokersPage = Loadable(lazy(() => import('views/pages/register/brokers')));
const OperatorsPage = Loadable(lazy(() => import('views/pages/register/operators')));
const ProposalsPage = Loadable(lazy(() => import('views/pages/register/proposals')));

// financial routing
const ProposalDownPage = Loadable(lazy(() => import('views/pages/financial/proposal-down')));
const BrokerReceiptsPage = Loadable(lazy(() => import('views/pages/financial/broker-receipts')));
const SupervisorReportPage = Loadable(lazy(() => import('views/pages/financial/supervisor-report')));
const AdvancePaymentsPage = Loadable(lazy(() => import('views/pages/financial/advance-payments')));
const BalanceReportPage = Loadable(lazy(() => import('views/pages/financial/balance-report')));
const OverdueBalancePage = Loadable(lazy(() => import('views/pages/financial/overdue-balance')));
const PaymentDelaysPage = Loadable(lazy(() => import('views/pages/financial/payment-delays')));

// admin routing
const AdminPage = Loadable(lazy(() => import('views/pages/admin')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'typography',
      element: <UtilsTypography />
    },
    {
      path: 'color',
      element: <UtilsColor />
    },
    {
      path: 'shadow',
      element: <UtilsShadow />
    },
    {
      path: '/sample-page',
      element: <SamplePage />
    },
    {
      path: 'pages/register/clients',
      element: <ClientsPage />
    },
    {
      path: 'pages/register/brokers',
      element: <BrokersPage />
    },
    {
      path: 'pages/register/operators',
      element: <OperatorsPage />
    },
    {
      path: 'pages/register/proposals',
      element: <ProposalsPage />
    },
    {
      path: 'financial/proposal-down',
      element: <ProposalDownPage />
    },
    {
      path: 'financial/broker-receipts',
      element: <BrokerReceiptsPage />
    },
    {
      path: 'financial/supervisor-report',
      element: <SupervisorReportPage />
    },
    {
      path: 'financial/advance-payments',
      element: <AdvancePaymentsPage />
    },
    {
      path: 'financial/balance-report',
      element: <BalanceReportPage />
    },
    {
      path: 'financial/overdue-balance',
      element: <OverdueBalancePage />
    },
    {
      path: 'financial/payment-delays',
      element: <PaymentDelaysPage />
    },
    {
      path: 'admin',
      element: (
        <MasterRoute>
          <AdminPage />
        </MasterRoute>
      )
    }
  ]
};

export default MainRoutes;
