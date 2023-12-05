import React, { useState } from 'react';
import { Button } from '@mui/material';
// import BasicModal from './BasicModal';

const infoBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
};

const InfoBar = () => {
	const [open, setOpen] = useState(false);

  const showFilters = () => {
    console.log('hi');
    // show the filter

  };

  return (
		<>
			<div style={infoBarStyle}>
				<h1>Listings</h1>
				<Button
					variant='outlined'
					sx={{ height: '3rem' }}
					onClick={() => showFilters()}
				>
					Filter Listings
				</Button>
			</div>
			{/* <BasicModal></BasicModal> */}
		</>
  );
};

export default InfoBar;
