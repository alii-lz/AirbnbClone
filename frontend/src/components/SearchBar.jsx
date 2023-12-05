import React from 'react';
import Slider from '@mui/material/Slider';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, Container, Paper, Grid, Typography, Box, Button } from '@mui/material';
import { getSpecificListing } from '../Helpers';

const SearchPanel = (props) => {
  const [dest, setDest] = React.useState('')
  const [price, setPrice] = React.useState([0, 0]);
  const [beds, setBeds] = React.useState([0, 0])
  const [review, setReviews] = React.useState('')
  const [checkout, setCheckOut] = React.useState('')
  const [checkIn, setCheckIn] = React.useState('')

  const getListingDetails = async (listingId) => {
    const response = await getSpecificListing(listingId)
    return response.listing
  }

  // TODO: IMPLEMENT REVIEW SORTING
  const filterListings = async (listing) => {
    if (dest !== '') {
      const filteredArray = listing.filter((listing) =>
        listing.title.toLowerCase().includes(dest.toLowerCase()) ||
        listing.address.city.toLowerCase().includes(dest.toLowerCase()))
      props.setFilter(true)
      props.setDateFilter(false)
      props.setFilteredListings(filteredArray)
    } else if (price[0] !== 0 || price[1] !== 0) {
      const filteredArray = listing.filter((item) =>
        item.price >= price[0] && item.price <= price[1]);
      console.log(filteredArray)
      props.setFilter(true)
      props.setDateFilter(false)
      props.setFilteredListings(filteredArray)
    } else if ((beds[0] !== 0 || beds[1] !== 0)) {
      const filteredArray = []
      for (const singleListing of listing) {
        const info = await getListingDetails(singleListing.id)
        info.id = singleListing.id
        if (info.metadata.bedrooms >= beds[0] && info.metadata.bedrooms <= beds[1]) {
          filteredArray.push(info)
        }
      }
      props.setFilter(true)
      props.setDateFilter(false)
      props.setFilteredListings(filteredArray)
    } else if (review === 1) {
      console.log('lowest to Highest')
      let filteredArray = []
      let reviewScore = 1;
      let numReviews = 1;
      let totalReviewScore = 0;
      for (const singleListing of listing) {
        numReviews = singleListing.reviews.length
        for (const review of singleListing.reviews) {
          reviewScore = reviewScore + review.score
        }
        totalReviewScore = reviewScore / numReviews
        singleListing.totalScore = totalReviewScore
        filteredArray.push(singleListing)
        reviewScore = 0;
        numReviews = 0;
        totalReviewScore = 0;
      }
      filteredArray = filteredArray.sort((a, b) => {
        if (a.totalScore < b.totalScore) {
          return -1;
        } else if (a.totalScore === b.totalScore) {
          return 0;
        } else {
          return 1
        }
      })
      props.setFilter(true)
      props.setDateFilter(false)
      props.setFilteredListings(filteredArray)
    } else if (review === 2) {
      console.log('Highest to lowest')
      let filteredArray = []
      let reviewScore = 0;
      let numReviews = 0;
      let totalReviewScore = 0;
      for (const singleListing of listing) {
        numReviews = singleListing.reviews.length
        for (const review of singleListing.reviews) {
          reviewScore = reviewScore + review.score
        }
        totalReviewScore = reviewScore / numReviews
        singleListing.totalScore = totalReviewScore
        filteredArray.push(singleListing)
        reviewScore = 0;
        numReviews = 0;
        totalReviewScore = 0;
      }
      filteredArray = filteredArray.sort((a, b) => {
        if (a.totalScore < b.totalScore) {
          return 1;
        } else if (a.totalScore === b.totalScore) {
          return 0;
        } else {
          return -1
        }
      })
      props.setFilter(true)
      props.setDateFilter(false)
      props.setFilteredListings(filteredArray)
    } else if (checkout !== '' || checkIn !== '') {
      props.setFilter(true)
      props.setDateFilter(true)
      props.setCheckIn(checkIn)
      props.setCheckOut(checkout)
      const filteredArray = []
      const checkInDate = new Date(checkIn.$y, checkIn.$M, checkIn.$D).setHours(0, 0, 0, 0)
      const checkoutDate = new Date(checkout.$y, checkout.$M, checkout.$D).setHours(0, 0, 0, 0)
      for (const singleListing of listing) {
        const info = await getListingDetails(singleListing.id)
        const validCheckin = new Date(info.availability[0].start).setHours(0, 0, 0, 0)
        const validCheckout = new Date(info.availability[0].end).setHours(0, 0, 0, 0)
        if (checkInDate >= validCheckin && checkoutDate <= validCheckout) {
          info.id = singleListing.id
          filteredArray.push(info)
        }
      }
      props.setFilteredListings(filteredArray)
    } else {
      props.setDateFilter(false)
      props.setFilter(false)
    }
  }

  return (
    <Container maxWidth="sm">
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h5" align="center" style={{ marginBottom: '20px' }}>
            Filter listings
          </Typography>
          <form>
            <Grid container spacing={3}>
              <Grid item xs={10} styles = {{ alignContent: 'center', justifyContent: 'center' }}>
              <TextField
                id = 'filled-basic'
                label = 'Where to'
                variant = 'filled'
                value = {dest}
                onChange={e => setDest(e.target.value)}
              ></TextField>
              </Grid>
              <Grid item xs={7}>
                <h4 style={{ textAlign: 'left' }}>Price:</h4>
                <Box sx={{ width: 300 }}>
                  <Slider
                    name = 'Price-slider'
                    min={0}
                    max={1000}
                    getAriaLabel={() => 'Price'}
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Grid>
              <Grid item xs={7}>
                <h4 style={{ textAlign: 'left' }}>Number of Bedrooms:</h4>
                <Box sx={{ width: 300 }}>
                  <Slider
                  min={0}
                  max={10}
                  getAriaLabel={() => 'Bedrooms'}
                  value={beds}
                  onChange={e => setBeds(e.target.value)}
                  valueLabelDisplay="auto"
                  />
                </Box>
              </Grid>
              <Grid item xs={8}>
                <InputLabel id="demo-simple-select-label" style = {{ textAlign: 'left', fontSize: '1.5rem' }}>Reviews</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  style = {{ width: '50%' }}
                  value={review}
                  label="Reviews"
                  onChange={e => setReviews(e.target.value)}
                  >
                  <MenuItem value={1} >Lowest To Highest</MenuItem>
                  <MenuItem value={2}>Highest To Lowest</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6} >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Container components={['DatePicker']}>
                    <DatePicker label="Check-in"value={checkIn} onChange={(newValue) => setCheckIn(newValue)} />
                  </Container>
                </LocalizationProvider>
              </Grid>
              <Grid item xs = {6} >
               <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Container components={['DatePicker']}>
                    <DatePicker label="Check-out" value={checkout} onChange={(newValue) => setCheckOut(newValue)}/>
                  </Container>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={5}>
                <Button
                aria-label="Search"
                onClick= { () => { filterListings(props.allListings) }}>search</Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
    </Container>
  );
};

export default SearchPanel;
