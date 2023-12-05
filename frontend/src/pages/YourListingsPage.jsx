import React, { useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import BasicModal from '../components/BasicModal';
import Listing from '../components/Listing';
import { getAllListings, getSpecificListing } from '../Helpers';

const YourListingsPage = ({ token, email }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [header, setHeader] = useState('');
  const [listings, setListings] = useState([]);

  const updateListings = async () => {
    const data = await getAllListings();

    let myListings = [];
    if (data.listings) {
      // extract the users listings
      const allListings = data.listings;
      myListings = allListings.filter((listing) => listing.owner === email);

      const listingsToShow = [];

      const getListingInfo = async (listing) => {
        const updatedListingInfo = await getSpecificListing(listing.id, token);
        // console.log(updatedListingInfo);
        if (updatedListingInfo.listing) {
          updatedListingInfo.listing.id = listing.id;
          listingsToShow.push(updatedListingInfo.listing);
        }
      }

      const arrayOfAsyncs = myListings.map((listing) => getListingInfo(listing))

      await Promise.all(arrayOfAsyncs);
      setListings(listingsToShow);
    } else {
      setOpen(true);
      setContent(data.error);
      setHeader('ERROR !!');
    }
  };

  useEffect(() => {
    updateListings();
  }, []);

  if (token === null) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <>
          You are not logged in.
        </>
      </Box>
    );
  }

  return (
    <>
      <>
        <Button sx={{ marginTop: '1em' }}
          variant="contained"
          aria-label="Create Listing"
          id='create-listing-btn'
          component={Link}
          to='/createListing'>
          Create Listing
        </Button>
      </>

      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
        {listings.map((listing, idx) => (
          <Listing
            key={idx}
            token={token}
            listing={listing}
            updateListings={() => updateListings()}
          />
        ))}
      </Box>

      <BasicModal open={open} setOpen={setOpen} content={content}
        header={header}
      ></BasicModal>
    </>
  );
}

export default YourListingsPage;
