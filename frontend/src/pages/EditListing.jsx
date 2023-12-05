import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import BACKEND_PORT from '../config.json';

// taken from mui
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

const EditListing = ({ token }) => {
  const port = BACKEND_PORT.BACKEND_PORT;
  const listingId = useParams();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [header, setHeader] = useState('');

  const [title, setTitle] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [price, setPrice] = useState(0);
  const [propertyType, setPropertyType] = useState('');
  const [numBathrooms, setNumBathrooms] = useState(0);
  const [bedrooms, setBedrooms] = useState(0);
  const [numBeds, setNumBeds] = useState(0);
  const [amenities, setAmenities] = useState('');
  const [propertyImages, setPropertyImages] = useState([]);

  const handlePropertyImages = (e) => {
    setPropertyImages(Array.from(e.target.files));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // convert property images to url.
    propertyImages.forEach(async (img) => {
      try {
        img = await fileToDataUrl(thumbnail);
      } catch (error) {
        setOpen(true);
        setContent('One of the property images was not a png, jpg or jpeg');
        setHeader('ERROR !!');
      }
    });

    // set up address object to pass for fetch requet's body
    const addressObj = {
      street,
      city,
      country,
    };

    // set up metadata
    const metadata = {
      propertyType,
      numBathrooms,
      numBeds,
      bedrooms,
      propertyImages,
      amenities,
    };

    // convert thumbnail url from file to url
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

    const response = await fetch(
      `http://localhost:${port}/listings/${listingId.id}`,
      {
        method: 'PUT',
        body: listingInfo,
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
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
      navigate('/yourListings');
    }
  };

  return (
    <>
      <Container maxWidth='sm'>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography
            variant='h5'
            align='center'
            style={{ marginBottom: '20px' }}
          >
            Enter New Listing Details
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
                    type='file'
                    name='thumbnail'
                    onChange={(e) => setThumbnail(e.target.files[0])}
                  />
                </Button>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label='Property Type'
                  name='propertyType'
                  type='text'
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  required
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
                <TextField
                  fullWidth
                  label='Amenities'
                  name='amenities'
                  type='text'
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                  required
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', justifyContent: 'space-around' }}
              >
                <Button
                  component='label'
                  variant='contained'
                  startIcon={<CloudUploadIcon />}
                >
                  Property images
                  <VisuallyHiddenInput
                    type='file'
                    name='property images'
                    multiple='multiple'
                    onChange={(e) => handlePropertyImages(e)}
                  />
                </Button>

                <Button
                  type='submit'
                  variant='contained'
                  color='success'
                  aria-label='Sumbit Edit Listing'
                  onClick={(e) => handleEditSubmit(e)}
                >
                  SAVE
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
              </Grid>
            </Grid>
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

export default EditListing;
