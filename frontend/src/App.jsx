import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import LandingPage from './pages/LandingPage.jsx';
import YourListingsPage from './pages/YourListingsPage.jsx';
import CreateListing from './pages/CreateListing.jsx';
import EditListing from './pages/EditListing.jsx';
import SingleListing from './pages/SingleListing.jsx';
import BookingRequest from './components/BookingRequest.jsx';

function App() {
  const [token, setToken] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [dateFilter, setDateFilter] = React.useState(false);
  const [checkIn, setCheckIn] = React.useState('');
  const [checkOut, setCheckOut] = React.useState('');

  return (
    <>
      <Router>
        <Navbar token={token} setToken={setToken} />
        <Routes>
          <Route
            path='/'
            element={
              <LandingPage
                token={token}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                setCheckIn={setCheckIn}
                setCheckOut={setCheckOut}
              />
            }
          />
          <Route
            path=':listingId'
            element={
              <SingleListing
                token={token}
                dateFilter={dateFilter}
                checkIn={checkIn}
                checkOut={checkOut}
                email={email}
              />
            }
          />
          <Route
            path='/register'
            element={
              <Register
                token={token}
                setToken={setToken}
                email={email}
                setEmail={setEmail}
              />
            }
          />
          <Route
            path='/login'
            element={
              <Login
                token={token}
                setToken={setToken}
                email={email}
                setEmail={setEmail}
              />
            }
          />
          <Route
            path='/yourListings'
            element={<YourListingsPage token={token} email={email} />}
          />
          <Route
            path='/createListing'
            element={<CreateListing token={token} />}
          />
          <Route
            path='/editListing/:id'
            element={<EditListing token={token} />}
          />
          <Route
            path='/viewBookingRequests/:id'
            element={<BookingRequest token={token} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
