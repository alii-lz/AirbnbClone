import { React, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import SVGRating from './SVGRating';
import Image from './Image';
import { Link } from 'react-router-dom';
import BasicModal from './BasicModal';
import AvailabilityModal from './AvailabilityModal';
import BACKEND_PORT from '../config.json';

const Listing = (props) => {
  const port = BACKEND_PORT.BACKEND_PORT;
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const openAvailabilityModal = () => {
    setIsAvailabilityModalOpen(true);
  };

  const listingInfo = props.listing;
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [header, setHeader] = useState('');
  const title = listingInfo.title;
  const propertyType = listingInfo.metadata.propertyType;
  const numBathrooms = listingInfo.metadata.numBathrooms;
  const numBeds = listingInfo.metadata.numBeds;
  const thumbnail = listingInfo.thumbnail;
  const reviewCount = listingInfo.reviews.length;
  const price = listingInfo.price;

  let total = 0;
  listingInfo.reviews.forEach((review) => {
    total += review.score;
  });

  const ratingScore = total / reviewCount;
  const listingId = listingInfo.id;

  const handleDelete = async () => {
    const response = await fetch(
      `http://localhost:${port}/listings/${listingId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${props.token}`,
        },
      }
    );

    const data = await response.json();
    if (data.error) {
      // if error, show error popup. else go to listings page
      setOpen(true);
      setContent(data.error);
      setHeader('ERROR !!');
    } else {
      // update Listings
      props.updateListings();
    }
  };

  // have a default thumbnail for alt
  return (
    <div className='listing'>
      <Image src={thumbnail} alt={'image of property'} />
      <h2>{title}</h2>
      <Typography>Property Type: {propertyType}</Typography>
      <Typography>Number of Beds: {numBeds}</Typography>
      <Typography>Number of Bathrooms: {numBathrooms}</Typography>
      <SVGRating value={ratingScore}></SVGRating>
      <Typography>{reviewCount} reviews</Typography>
      <Typography>Price per Night: ${price}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Button
          variant='outlined'
          component={Link}
          to={`/editListing/${listingId}`}
        >
          Edit
        </Button>
        <Button variant='outlined' onClick={() => handleDelete()} color='error'>
          Delete
        </Button>
        <Button variant='outlined' onClick={() => openAvailabilityModal()}>
          Go Live
        </Button>
        <Button
          variant='outlined'
          component={Link}
          to={`/viewBookingRequests/${listingId}`}
        >
          View booking requests
        </Button>
        {isAvailabilityModalOpen && (
          <AvailabilityModal
            onClose={() => setIsAvailabilityModalOpen(false)}
            token={props.token}
            listingInfo={listingInfo}
          />
        )}
      </Box>

      <BasicModal
        open={open}
        setOpen={setOpen}
        content={content}
        header={header}
      ></BasicModal>
    </div>
  );
};

export default Listing;
