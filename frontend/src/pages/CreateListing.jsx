import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Container,
  Paper,
  Grid,
  Typography,
  styled,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BasicModal from '../components/BasicModal.jsx';
import { fileToDataUrl } from '../Helpers.js';
import InputDropdown from '../components/InputDropdown.jsx';
import AmenitiesCheckboxes from '../components/AmenitiesCheckboxes.jsx';
import BACKEND_PORT from '../config.json';

// This is needed for the mui component VisuallyHidden Input
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const CreateListing = (props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [header, setHeader] = useState('');

  const [title, setTitle] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [price, setPrice] = useState(0);
  const [thumbnail, setThumbnail] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [numBathrooms, setNumBathrooms] = useState(0);
  const [bedrooms, setBedrooms] = useState(0);
  const [numBeds, setNumBeds] = useState(0);
  const [amenities, setAmenities] = useState([]);

  const propertyOptions = ['House', 'Apartment', 'Hotel'];
  const handlePropertyTypeChange = (e) => {
    setPropertyType(e.target.value);
  };

  const handleAmenitiesChange = (selectedAmenities) => {
    setAmenities(selectedAmenities);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      title === '' ||
      street === '' ||
      city === '' ||
      country === '' ||
      propertyType === ''
    ) {
      setOpen(true);
      setContent('Please input all fields');
      setHeader('ERROR !!');
      return;
    }

    if (price <= 0) {
      setOpen(true);
      setContent('Your listing cant be for free');
      setHeader('ERROR !!');
      return;
    }

    if (numBeds <= 0 || numBathrooms <= 0 || bedrooms <= 0) {
      setOpen(true);
      setContent('You cant have 0 bedrooms, bathrooms or beds');
      setHeader('ERROR !!');
      return;
    }

    const addressObj = {
      street,
      city,
      country,
    };

    const metadata = {
      propertyType,
      numBathrooms,
      numBeds,
      bedrooms,
      amenities,
      propertyImages: [],
    };

    let thumbnailUrl = '';
    try {
      thumbnailUrl = await fileToDataUrl(thumbnail);
    } catch (error) {
      setOpen(true);
      setContent('Listing thumbnail was not a png, jpg or jpeg');
      setHeader('ERROR !!');
      return;
    }

    const listingInfo = JSON.stringify({
      title,
      address: addressObj,
      price: parseInt(price),
      thumbnail: thumbnailUrl,
      metadata,
    });

    const port = BACKEND_PORT.BACKEND_PORT;

    const response = await fetch(`http://localhost:${port}/listings/new`, {
      method: 'POST',
      body: listingInfo,
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${props.token}`,
      },
    });

    const data = await response.json();
    if (data.error) {
      setOpen(true);
      setContent(data.error);
      setHeader('ERROR !!');
    } else {
      // go to listings page
      navigate('/yourListings');
    }
  };

  return (
    <>
      <Container maxWidth='sm'>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography
            name='createListing-Title'
            variant='h5'
            align='center'
            style={{ marginBottom: '20px' }}
          >
            Enter Listing Details
          </Typography>
          <form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Listing Title'
                  name='title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label='Street'
                  name='street'
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label='City'
                  name='city'
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label='Country'
                  name='country'
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label='Listing Price (per night)'
                  name='price'
                  type='number'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  component='label'
                  variant='contained'
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Listing Thumbnail
                  <VisuallyHiddenInput
                    aria-label='Upload Thumbnail'
                    type='file'
                    name='thumbnail'
                    onChange={(e) => setThumbnail(e.target.files[0])}
                  />
                </Button>
              </Grid>
              <Grid item xs={6}>
                <InputDropdown
                  label='Property Type'
                  options={propertyOptions}
                  value={propertyType}
                  onChange={(e) => handlePropertyTypeChange(e)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label='Number of Bathrooms'
                  name='bathrooms'
                  type='number'
                  value={numBathrooms}
                  onChange={(e) => setNumBathrooms(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label='Bedrooms'
                  name='bedrooms'
                  type='number'
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label='Number of beds in each bedroom'
                  name='numberOfBeds'
                  type='number'
                  value={numBeds}
                  onChange={(e) => setNumBeds(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h6'>Select Amenities</Typography>
                <AmenitiesCheckboxes
                  selectedAmenities={amenities}
                  onChange={handleAmenitiesChange}
                />
              </Grid>
            </Grid>
            <Button
              type='submit'
              variant='contained'
              color='success'
              onClick={(e) => handleSubmit(e)}
            >
              Submit
            </Button>
            <Button
              type='submit'
              variant='contained'
              color='error'
              component={Link}
              to='/yourListings'
            >
              Cancel
            </Button>
          </form>
        </Paper>
      </Container>
      <BasicModal
        open={open}
        setOpen={setOpen}
        content={content}
        header={header}
      ></BasicModal>
    </>
  );
};

export default CreateListing;
