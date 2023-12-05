import * as React from 'react';
import { Rating, Stack } from '@mui/material';

const SVGRating = ({ rating }) => {
  return (
    <Stack spacing={1}>
      <Rating name="rating" value={rating} readOnly />
    </Stack>
  );
}

export default SVGRating;
