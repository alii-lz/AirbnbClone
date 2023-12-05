import { Button } from '@mui/material';
import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import BasicModal from '../components/BasicModal.jsx';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { getSpecificListing } from '../Helpers.js';
import BACKEND_PORT from '../config.json';
import InfoBar from '../components/InfoBar.jsx';

const LandingPage = (props) => {
  const port = BACKEND_PORT.BACKEND_PORT;
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [header, setHeader] = useState('');

  const [allListings, setAllListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState(false);
  const [filteredListings, setFilteredListings] = useState([]);

  const fetchListings = async () => {
    props.setDateFilter(false);
    fetch(`http://localhost:${port}/listings`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(async (allListings) => {
        const listings = [];
        for (const listing of allListings.listings) {
          const info = await getSpecificListing(listing.id);
          if (info.listing.published !== false) {
            info.listing.id = listing.id;
            listings.push(info.listing);
          }
        }
        setAllListings(listings);
      });
  };

  // Get all listings when the page is loaded
  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    if (props.token !== null) {
      fetch(`http://localhost:${port}/bookings`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${props.token}`,
        },
      })
        .then((res) => res.json())
        .then((userBookings) => {
          setBookings(userBookings.bookings);
        });
    }
  }, []);

  // Sort alhabetically
  allListings.sort((a, b) =>
    a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1
  );
  // If user is logged in sort users own bokoing by pending booked etc.
  if (props.token !== null) {
    for (const booking in bookings) {
      for (const listing in allListings) {
        if (
          booking.id === listing.id &&
          (booking.status === 'accepted' || booking.status === 'pending')
        ) {
          allListings.sort((a, b) =>
            a.id === listing.id ? -1 : b.id === listing.id ? 1 : 0
          );
        }
      }
    }
  }

  const handleRemove = async (e, listingId) => {
    e.preventDefault();
    const response = await fetch(
      `http://localhost:${port}/listings/unpublish/${listingId}`,
      {
        method: 'PUT',
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
      // go to listings page
      // reload the listings
      fetchListings();
    }
  };

  return (
    <>
      <InfoBar />
      {/* <SearchBar
        allListings={allListings}
        filter={filter}
        setFilter={setFilter}
        setFilteredListings={setFilteredListings}
        setDateFilter={props.setDateFilter}
        setCheckIn={props.setCheckIn}
        setCheckOut={props.setCheckOut}
      /> */}
      {filter === true ? (
        <>
          {filteredListings.map((listing) => (
            <Button
              key={listing.id}
              component={Link}
              to={`${listing.id}`}
              sx={{ my: 2 }}
            >
              <Card sx={{ maxWidth: 345, minWidth: 345 }}>
                <CardMedia
                  sx={{ height: 140 }}
                  image={listing.thumbnail}
                  title='Listing Image'
                />
                <CardContent>
                  <Typography gutterBottom variant='h5' component='div'>
                    {listing.title}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {listing.address.street +
                      ', ' +
                      listing.address.city +
                      ', ' +
                      listing.address.country}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Typography variant='body2' color='text.secondary'>
                    {listing.reviews.length + ' reviews'}
                  </Typography>
                </CardActions>
              </Card>
              <Button onClick={(e) => handleRemove(e, listing.id)}>
                Remove
              </Button>
            </Button>
          ))}
        </>
      ) : (
        <>
          {allListings.map((listing) => (
            <Button
              key={listing.id}
              component={Link}
              to={`${listing.id}`}
              sx={{ my: 2 }}
            >
              <Card sx={{ maxWidth: 345, minWidth: 345 }}>
                <CardMedia
                  sx={{ height: 140 }}
                  src={listing.thumbnail}
                  title='Listing Image'
                  component='img'
                />
                <CardContent>
                  <Typography gutterBottom variant='h5' component='div'>
                    {listing.title}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {listing.address.street +
                      ', ' +
                      listing.address.city +
                      ', ' +
                      listing.address.country}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Typography variant='body2' color='text.secondary'>
                    {listing.reviews.length + ' reviews'}
                  </Typography>
                </CardActions>
                <Button onClick={(e) => handleRemove(e, listing.id)}>
                  Remove
                </Button>
              </Card>
            </Button>
          ))}
        </>
      )}
      <BasicModal
        open={open}
        setOpen={setOpen}
        content={content}
        header={header}
      ></BasicModal>
    </>
  );
};

export default LandingPage;
