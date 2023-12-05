import React, { useEffect, useState, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import BasicModal from './BasicModal';
import { Box, Typography, Button } from '@mui/material';
import {
  getAllBookings,
  getSpecificListing,
  calculateTimeDifference,
  getDaysBooked,
  getProfit,
} from '../Helpers';
import BACKEND_PORT from '../config.json';

const BookingRequest = ({ token }) => {
  const port = BACKEND_PORT.BACKEND_PORT;
  const listingId = useParams();
  const [bookings, setBookings] = useState([]);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [header, setHeader] = useState('');

  const [listing, setListing] = useState({});

  const fetchListing = async () => {
    const data = await getSpecificListing(listingId.id, token);
    setListing(data.listing);
  };

  // get all bookings
  // filter out the bookings on listingId
  const fetchBookings = async () => {
    const data = await getAllBookings(token);

    let myBookings = [];
    if (data.bookings) {
      // extract the listing's bookings
      const allBookings = data.bookings;
      myBookings = allBookings.filter(
        (booking) => booking.listingId === listingId.id
      );
      setBookings(myBookings);
    } else {
      setOpen(true);
      setContent(data.error);
      setHeader('ERROR !!');
    }
  };

  // useEffect to get the bookings
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        fetchBookings();
      } catch (error) {
        setOpen(true);
        setContent(error);
        setHeader('ERROR !!');
      }
    };

    fetchBookingData();
    fetchListing();
  }, []);

  const extractDate = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString();
  };

  const timeSincePosted = calculateTimeDifference(listing.postedOn);
  const daysBooked = getDaysBooked(bookings);
  const profit = getProfit(bookings);

  const acceptBookingRequest = async (bookingId) => {
    const response = await fetch(
      `http://localhost:${port}/bookings/accept/${bookingId}`,
      {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    if (data.error) {
      setOpen(true);
      setContent(data.error);
      setHeader('ERROR !!');
    } else {
      setOpen(true);
      setContent('booking was Accepted');
      setHeader('SUCCESS !!');
      // setContent();
      fetchBookings();
    }
  };

  const denyBookingRequest = async (bookingId) => {
    const response = await fetch(
      `http://localhost:${port}/bookings/decline/${bookingId}`,
      {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    if (data.error) {
      setOpen(true);
      setContent(data.error);
      setHeader('ERROR !!');
    } else {
      setOpen(true);
      setContent('booking was Accepted');
      setHeader('SUCCESS !!');
      fetchBookings();
    }
  };

  return (
    <>
      <Box>
        <Typography variant='h3'>{listing.title}</Typography>
        <Typography>Listing Posted {timeSincePosted} ago</Typography>
        <Typography>Listing booked for {daysBooked} days</Typography>
        <Typography>Profit this year: ${profit}</Typography>
      </Box>
      <br />
      <Box>
        <Typography variant='h6'>Booking Requests:</Typography>
        {bookings.map((booking) => (
          <Box key={booking.id} sx={{ marginBottom: 2.5 }}>
            <Typography>Request by: {booking.owner}</Typography>
            <Typography>
              From {extractDate(booking.dateRange.start)} to{' '}
              {extractDate(booking.dateRange.end)}
            </Typography>
            <Typography>
              Status: <b>{booking.status.toUpperCase()}</b>
            </Typography>
            <Button
              variant='contained'
              color='success'
              onClick={() => acceptBookingRequest(booking.id)}
            >
              Accept
            </Button>
            <Button
              variant='contained'
              color='error'
              onClick={() => denyBookingRequest(booking.id)}
            >
              Deny
            </Button>
          </Box>
        ))}
      </Box>
      <BasicModal
        open={open}
        setOpen={setOpen}
        content={content}
        header={header}
      ></BasicModal>
    </>
  );
};

export default BookingRequest;
