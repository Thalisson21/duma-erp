// assets
import {
  IconCash,
  IconClockDollar,
  IconFileDownload,
  IconReceipt,
  IconReportAnalytics,
  IconReportMoney,
  IconScale,
  IconTransfer,
  IconWallet
} from '@tabler/icons-react';

// constant
const icons = {
  IconCash,
  IconClockDollar,
  IconFileDownload,
  IconReceipt,
  IconReportAnalytics,
  IconReportMoney,
  IconScale,
  IconTransfer,
  IconWallet
};

// ==============================|| EXTRA FINANCIAL MENU ITEMS ||============================== //

const pages = {
  id: 'financial',
  title: 'Financeiro',
  caption: 'Módulo Financeiro',
  icon: icons.IconWallet,
  type: 'group',
  children: [
    {
      id: 'financial-operations',
      title: 'Operações Financeiras',
      type: 'collapse',
      icon: icons.IconTransfer,
      children: [
        {
          id: 'proposal-down',
          title: 'Baixar Proposta',
          type: 'item',
          icon: icons.IconFileDownload,
          url: '/financial/proposal-down'
        },
        {
          id: 'broker-receipts',
          title: 'Recibos do Corretor',
          type: 'item',
          icon: icons.IconReceipt,
          url: '/financial/broker-receipts'
        },
        {
          id: 'supervisor-report',
          title: 'Relatório Supervisor',
          type: 'item',
          icon: icons.IconReportAnalytics,
          url: '/financial/supervisor-report'
        },
        {
          id: 'advance-payments',
          title: 'Adiantamentos',
          type: 'item',
          icon: icons.IconCash,
          url: '/financial/advance-payments'
        },
        {
          id: 'balance-report',
          title: 'Relatório de Saldo',
          type: 'item',
          icon: icons.IconReportMoney,
          url: '/financial/balance-report'
        },
        {
          id: 'overdue-balance',
          title: 'Saldo devedor',
          type: 'item',
          icon: icons.IconScale,
          url: '/financial/overdue-balance'
        },
        {
          id: 'payment-delays',
          title: 'Atrasos de Pagamento',
          type: 'item',
          icon: icons.IconClockDollar,
          url: '/financial/payment-delays'
        },
      ]
    }
  ]
};

export default pages;
