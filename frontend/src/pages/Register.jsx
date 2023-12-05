import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import BACKEND_PORT from '../config.json';

const Register = (props) => {
  const port = BACKEND_PORT.BACKEND_PORT;
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordCheck, setPasswordCheck] = React.useState('');
  const [errorPage, setErrorPage] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== passwordCheck) {
      setErrorMsg('Passwords do not Match. Please Try again.');
      setErrorPage(true);
      return;
    } else if (password.length < 6) {
      setErrorMsg('Password must be atleast 6 characters. Please Try again.');
      setErrorPage(true);
      return;
    } else if (name.length <= 1 || !name.replace(/\s/g, '').length) {
      setErrorMsg('Invalid Name. Please Try again.');
      setErrorPage(true);
      return;
    }
    const response = await fetch(
      `http://localhost:${port}/user/auth/register`,
      {
        method: 'POST',
        body: JSON.stringify({
          email,
          name,
          password,
        }),
        headers: {
          'Content-type': 'application/json',
        },
      }
    );
    const data = await response.json();
    if (data.error) {
      setErrorMsg(data.error);
      setErrorPage(true);
    } else if (data.token) {
      props.setToken(data.token);
      props.setEmail(email);
      navigate('/');
    }
  };

  return (
    <>
      {errorPage ? (
        <>
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity='error'> {errorMsg} </Alert>
          </Stack>
        </>
      ) : (
        <></>
      )}
      <Box
        component='form'
        noValidate
        autoComplete='off'
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
          flexGrow: 3,
        }}
        style={{
          width: '40%',
          backgroundColor: '#ffffff',
          margin: 'auto',
          marginTop: '10%',
          borderRadius: '25px',
        }}
      >
        <Grid
          name='Registration-grid'
          container
          spacing={2}
          style={{ margin: 'auto' }}
        >
          <h2 style={{ margin: 'auto', marginBottom: '5%' }}>Register</h2>
          <Grid xs={12}>
            <TextField
              id='outlined-basic'
              name='register-name'
              label='Name'
              variant='outlined'
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              id='outlined-basic'
              name='register-email'
              label='Email'
              variant='outlined'
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              id='outlined-basic'
              name='register-password'
              label='Pasword'
              variant='outlined'
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              id='outlined-basic'
              name='register-password-confirm'
              label='Confirm Password'
              variant='outlined'
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
          </Grid>
          <Grid xs={12}>
            <Button
              id='register-submit-btn'
              variant='text'
              onClick={handleRegister}
              style={{ textAlign: 'center' }}
              aria-label='Register Submit'
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Register;
