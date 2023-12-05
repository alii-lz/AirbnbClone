import * as React from 'react';
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import BasicModal from './BasicModal';
import SuccessPopup from './SuccessPopup.jsx';
import BACKEND_PORT from '../config.json';

const Navbar = (props) => {
  const port = BACKEND_PORT.BACKEND_PORT;
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [content, setContent] = React.useState('');
  const [successOpen, setSuccessOpen] = React.useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();

    const token = props.token;

    const response = await fetch(`http://localhost:${port}/user/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });

    const data = await response.json();

    if (data.error) {
      // show modal
      setOpen(true);
      setContent(data.error);
    } else {
      props.setToken(null);
      navigate('/');
      setSuccessOpen(true);
    }
  };

  const handleSuccessClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessOpen(false);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, backgroundColor: 'red' }}>
        <AppBar position="static" color='primary'>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Welcome to Airbrb!
            </Typography>
            <Button
              aria-label="All Listings"
              color="inherit"
              component={Link}
              to="/"
            >
              All listings
            </Button>
            <Button
              aria-label="Your Listings"
              color="inherit"
              id='nav-yourListings-btn'
              component={Link}
              to="/yourListings"
            >
              Your Listings
            </Button>
            <Button
              aria-label='Register'
              color="inherit"
              id='nav-register-btn'
              component={Link}
              to="/register"
            >
              Register
            </Button>
            <Button
              aria-label="Login"
              color="inherit"
              component={Link}
              to="/login"
            >
              Login
            </Button>
            <Button color="inherit"
              component={Link}
              to="/"
              onClick={(e) => handleLogout(e)}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <BasicModal open={open} setOpen={setOpen} content={content}> header{'ERROR !!'}
      </BasicModal>
      <SuccessPopup
        open={successOpen}
        handleClose={handleSuccessClose}
        message={'Logout Successful :D'}
      />
    </>
  );
}

export default Navbar;
