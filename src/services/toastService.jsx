import PropTypes from 'prop-types';
import * as React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const ToastContext = React.createContext(null);

const defaultDuration = 5000;

export function ToastProvider({ children }) {
  const [toast, setToast] = React.useState(null);

  const showToast = React.useCallback((severity, message, options = {}) => {
    setToast({
      severity,
      message,
      duration: options.duration ?? defaultDuration
    });
  }, []);

  const value = React.useMemo(
    () => ({
      success: (message, options) => showToast('success', message, options),
      error: (message, options) => showToast('error', message, options),
      warning: (message, options) => showToast('warning', message, options),
      info: (message, options) => showToast('info', message, options)
    }),
    [showToast]
  );

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setToast(null);
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={toast?.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {toast ? (
          <Alert severity={toast.severity} variant="filled" onClose={handleClose} sx={{ width: '100%' }}>
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </ToastContext.Provider>
  );
}

ToastProvider.propTypes = {
  children: PropTypes.node
};

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error('useToast deve ser usado dentro de ToastProvider.');
  }

  return context;
}
