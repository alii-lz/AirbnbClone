import React from 'react';
import { Box } from '@mui/material';

const Image = ({ src, alt }) => {
  return (
    <Box
      component="img"
      sx={{
        height: '15rem',
        width: '15rem',
        maxHeight: { xs: '10rem', md: '15rem' },
        maxWidth: { xs: '8rem', md: '15rem' },
      }}
      alt={alt}
      src={src}
    />
  );
}

export default Image;
