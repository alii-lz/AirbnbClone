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

export default function BookingConfirmation ({ open, setOpen, content }) {
  const handleClose = () => setOpen(false);

  return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Button
            onClick={handleClose}
            style={{ position: 'absolute', top: '0', right: '0' }}
          >
            X
          </Button>
          <Typography name = "title"id="modal-modal-title" variant="h6" component="h2">
            Booking Made!!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {content}
          </Typography>
        </Box>
      </Modal>
  );
}
