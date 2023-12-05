import React from 'react';
import { Snackbar } from '@mui/material';

const SuccessPopup = ({ open, handleClose, message }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      message={message}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    />
  );
};

export default SuccessPopup;
