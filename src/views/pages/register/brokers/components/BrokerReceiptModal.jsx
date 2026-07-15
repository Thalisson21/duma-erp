import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { PDFViewer } from '@react-pdf/renderer';
import { IconX } from '@tabler/icons-react';

import BrokerReceiptDocument from './BrokerReceiptDocument';

export default function BrokerReceiptModal({ open, onClose, report, isAdvance }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" PaperProps={{ sx: { height: '90vh' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1.5 }}>
        <Typography variant="h5">
          {isAdvance ? 'Recibo de Adiantamento' : 'Recibo de Pagamento'} Nº {report?.id ?? '-'}
        </Typography>
        <IconButton onClick={onClose} size="small" aria-label="Fechar">
          <IconX size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {open && report && (
          <PDFViewer width="100%" height="100%" style={{ border: 'none', display: 'block' }}>
            <BrokerReceiptDocument report={report} isAdvance={isAdvance} />
          </PDFViewer>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}

BrokerReceiptModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  report: PropTypes.object,
  isAdvance: PropTypes.bool
};
