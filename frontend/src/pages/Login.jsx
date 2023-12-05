import React, { useState } from 'react';
import {
  Button,
  TextField,
  Container,
  Paper,
  Typography,
  Grid,
  Stack,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BACKEND_PORT from '../config.json';

const Login = (props) => {
  const port = BACKEND_PORT.BACKEND_PORT;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorPage, setErrorPage] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:${port}/user/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    });

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
      {errorPage === true ? (
        <>
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity='error'> {errorMsg} </Alert>
          </Stack>
        </>
      ) : (
        <></>
      )}
      <Container maxWidth='sm' style={{ marginTop: '5em' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant='h4' align='center'>
            Login
          </Typography>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label='Email'
                  type='email'
                  fullWidth
                  name='login-email'
                  variant='outlined'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label='Password'
                  type='password'
                  fullWidth
                  name='login-password'
                  variant='outlined'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  id='login-submit-btn'
                  aria-label='Login'
                  fullWidth
                  onClick={(e) => handleLoginSubmit(e)}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default Login;
