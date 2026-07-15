import PropTypes from 'prop-types';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { formatDate } from 'utils/masks';

const INK = '#1f2937';
const MUTED = '#6b7280';
const DIVIDER = '#e5e7eb';
const SURFACE = '#f9fafb';
const ACCENT = '#2563eb';

function formatCurrency(value) {
  const numeric = Number(value ?? 0);
  return numeric.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getReceiptStatus(report) {
  if (report?.is_paid) return { label: 'Pago', color: '#1b7a35', bg: '#e9f9ee' };
  if (report?.is_canceled) return { label: 'Cancelado', color: '#c62828', bg: '#fdecec' };
  return { label: 'Pendente', color: '#1565c0', bg: '#e8f1fc' };
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 9.5, fontFamily: 'Helvetica', color: INK },

  // Header
  eyebrowRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  eyebrowBadge: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: ACCENT, letterSpacing: 1.2 },
  receiptNumber: { fontSize: 8.5, color: MUTED },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 },
  title: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: INK },
  statusPill: { paddingVertical: 3, paddingHorizontal: 10, borderRadius: 999, fontSize: 8, fontFamily: 'Helvetica-Bold' },

  divider: { borderBottomWidth: 1, borderBottomColor: DIVIDER, marginBottom: 14 },

  // Broker meta
  metaRow: { flexDirection: 'row', marginBottom: 20 },
  metaBlock: { flex: 1 },
  metaLabel: { fontSize: 7.5, color: MUTED, letterSpacing: 0.8, marginBottom: 3 },
  metaValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: INK },

  // Table
  sectionLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: MUTED, letterSpacing: 0.8, marginBottom: 8 },
  table: { marginBottom: 20 },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: SURFACE,
    borderBottomWidth: 1,
    borderBottomColor: DIVIDER,
    paddingVertical: 6
  },
  tableHeaderCell: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: MUTED, paddingHorizontal: 4 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: DIVIDER, paddingVertical: 7 },
  tableCell: { fontSize: 8.5, color: INK, paddingHorizontal: 4 },
  emptyCell: { fontSize: 8.5, color: MUTED, paddingVertical: 10, textAlign: 'center', width: '100%' },

  // Summary
  summaryWrap: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 24 },
  summaryBox: { width: '55%' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  summaryLabel: { fontSize: 9, color: MUTED },
  summaryValue: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: INK },
  negativeValue: { color: '#c62828' },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: DIVIDER,
    marginTop: 4,
    paddingTop: 8
  },
  summaryTotalLabel: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: INK },
  summaryTotalValue: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: ACCENT },

  // Declaration
  declarationBox: { backgroundColor: SURFACE, borderRadius: 6, padding: 14, marginBottom: 28 },
  declaration: { fontSize: 8, lineHeight: 1.6, color: MUTED, textAlign: 'justify' },

  // Signature
  dateLine: { fontSize: 9, textAlign: 'center', color: INK, marginBottom: 40 },
  signatureBlock: { alignItems: 'center' },
  signatureLine: { fontSize: 9, color: INK, marginBottom: 4 },
  signatureLabel: { fontSize: 8, color: MUTED },

  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 7,
    color: MUTED
  }
});

const COLUMN_FLEX = [1.1, 0.9, 1, 0.8, 0.6, 1, 1.1, 1.2];
const COLUMN_ALIGN = ['left', 'center', 'right', 'center', 'center', 'right', 'left', 'left'];

function TableRowCells({ values, cellStyle }) {
  return values.map((value, index) => (
    <Text
      key={index}
      style={[cellStyle, { flex: COLUMN_FLEX[index], textAlign: COLUMN_ALIGN[index] }]}
    >
      {value}
    </Text>
  ));
}

export default function BrokerReceiptDocument({ report, isAdvance }) {
  const broker = report?.broker || {};
  const receipts = Array.isArray(report?.receipts) ? report.receipts : [];
  const status = getReceiptStatus(report);
  const eyebrow = isAdvance ? 'ADIANTAMENTO' : 'PAGAMENTO';
  const title = isAdvance ? 'Demonstrativo de Adiantamento' : 'Demonstrativo de Pagamento';

  return (
    <Document title={`${eyebrow} ${report?.id ?? ''} - ${broker.name || ''}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.eyebrowRow}>
          <Text style={styles.eyebrowBadge}>{eyebrow} · SOBRE AS ANGARIAÇÕES</Text>
          <Text style={styles.receiptNumber}>Recibo Nº {report?.id ?? '-'}</Text>
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.statusPill, { color: status.color, backgroundColor: status.bg }]}>{status.label}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metaRow}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>CORRETOR</Text>
            <Text style={styles.metaValue}>{broker.name || '-'}</Text>
            <Text style={[styles.metaLabel, { marginTop: 3 }]}>{broker.broker_type?.description || 'Corretor'}</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>CPF/CNPJ</Text>
            <Text style={styles.metaValue}>{broker.cpf_or_cnpj || '-'}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>PROPOSTAS VINCULADAS</Text>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow} fixed>
            <TableRowCells
              cellStyle={styles.tableHeaderCell}
              values={['Proposta', 'Dt. Pgo.', 'V. Baixado', 'Parcela', '%', 'A pagar', 'Operadora', 'Plano']}
            />
          </View>

          {receipts.length === 0 && <Text style={styles.emptyCell}>Nenhuma proposta vinculada a este recibo.</Text>}

          {receipts.map((item, index) => (
            <View style={styles.tableRow} wrap={false} key={item.id ?? index}>
              <TableRowCells
                cellStyle={styles.tableCell}
                values={[
                  item.proposal?.proposal_number ?? '-',
                  formatDate(item.discharge_date),
                  formatCurrency(item.downloaded_value),
                  item.installment_number ?? '-',
                  item.installment_percentage != null ? `${item.installment_percentage}%` : '-',
                  formatCurrency(item.amount_to_pay),
                  item.proposal?.plan?.operator?.name ?? '-',
                  item.proposal?.plan?.description ?? '-'
                ]}
              />
            </View>
          ))}
        </View>

        <View style={styles.summaryWrap} wrap={false}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Valor bruto</Text>
              <Text style={styles.summaryValue}>{formatCurrency(report?.gross_value)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Taxa de administração</Text>
              <Text style={styles.summaryValue}>{formatCurrency(report?.instalmment_fee_value)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Adiantamento</Text>
              <Text style={[styles.summaryValue, styles.negativeValue]}>{formatCurrency(report?.debit_value)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Débito atual</Text>
              <Text style={[styles.summaryValue, styles.negativeValue]}>{formatCurrency(broker.balance)}</Text>
            </View>
            <View style={styles.summaryTotalRow}>
              <Text style={styles.summaryTotalLabel}>Líquido a receber</Text>
              <Text style={styles.summaryTotalValue}>{formatCurrency(report?.net_value)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.declarationBox} wrap={false}>
          <Text style={styles.declaration}>
            EU, {broker.name || '-'}, CPF/CNPJ nº {broker.cpf_or_cnpj || '-'}, corretor(a) autônomo, recebi a importância supra de{' '}
            {formatCurrency(report?.net_value)} referente à prestação de serviços de vendas. Declaro ainda que não trabalho com
            exclusividade e que não tenho e nem aceito vínculo empregatício, estando livre na condição de vendedor autônomo,
            avulso e/ou free lance, podendo continuar vendendo ao mesmo tempo para outras empresas e até mesmo concorrentes. Pelo
            qual dou plena e total quitação.
          </Text>
        </View>

        <Text style={styles.dateLine}>Data: _____ / _____ / _____</Text>

        <View style={styles.signatureBlock} wrap={false}>
          <Text style={styles.signatureLine}>__________________________________</Text>
          <Text style={styles.signatureLabel}>Assinatura do corretor</Text>
          <Text style={styles.signatureLabel}>{broker.name || '-'}</Text>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} fixed />
      </Page>
    </Document>
  );
}

BrokerReceiptDocument.propTypes = { report: PropTypes.object, isAdvance: PropTypes.bool };
