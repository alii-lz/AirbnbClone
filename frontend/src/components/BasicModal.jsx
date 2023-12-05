import * as React from 'react';
import { Box, Typography, Modal, Button } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const BasicModal = ({ open, setOpen, content, header }) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Button
          onClick={handleClose}
          style={{ position: 'absolute', top: '0', right: '0' }}
        >
          X
        </Button>
        <Typography
          name='header'
          id='modal-modal-title'
          variant='h6'
          component='h2'
        >
          {header}
        </Typography>
        <Typography name='content' id='modal-modal-description' sx={{ mt: 2 }}>
          {content}
        </Typography>
      </Box>
    </Modal>
  );
};

export default BasicModal;
