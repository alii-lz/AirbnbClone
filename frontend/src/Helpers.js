import BACKEND_PORT from './config.json';

const port = BACKEND_PORT.BACKEND_PORT;

// HELPER FUNCTION TO CONVERT FILE INTO URL
export const fileToDataUrl = (file) => {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const valid = validFileTypes.find((type) => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
};

// function to get all listings
export const getAllListings = async () => {
  const response = await fetch(`http://localhost:${port}/listings`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
  });

  const data = await response.json();
  return data;
};

// function to get details about a specific listing
export const getSpecificListing = async (listingId, token) => {
  const response = await fetch(`http://localhost:${port}/listings/${listingId}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};

// function to get users bookings for a particular listing
export const getUserBookingsForListing = async (
  token,
  userEmail,
  listingId
) => {
  const response = await fetch(`http://localhost:${port}/bookings`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  const userBookings = [];

  for (const booking of data.bookings) {
    if (booking.owner === userEmail && booking.listingId === listingId) {
      userBookings.push(booking);
    }
  }
  return userBookings;
};

// function to make a booking on a particular listing
export const makeBookingOnListing = async (
  token,
  listingId,
  price,
  start,
  end,
  nights
) => {
  const totalPrice = price * nights;
  const bookingInfo = JSON.stringify({
    dateRange: { start, end },
    totalPrice,
  });
  const response = await fetch(
    `http://localhost:${port}/bookings/new/${listingId}`,
    {
      method: 'POST',
      body: bookingInfo,
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const booking = await response.json();
  return booking;
};

// function to make a review on a particular listing
export const makeReviewOnListing = async (
  token,
  listingId,
  bookingId,
  comment,
  score
) => {
  const reviewObj = JSON.stringify({
    review: { comment, score },
  });
  const response = await fetch(
    `http://localhost:${port}/listings/${listingId}/review/${bookingId}`,
    {
      method: 'PUT',
      body: reviewObj,
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const review = await response.json();
  return review;
};

// function that fetches all the bookings
export const getAllBookings = async (token) => {
  const response = await fetch(`http://localhost:${port}/bookings`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
};

// function that returns the time since a listing was posted
// in the format: XXXX years, XX months, XX days, XX hrs, XX mins, XX secs
//  where the years/months/days/hours/minutes/seconds
//  will be hidden if the value is low enough.
export const calculateTimeDifference = (postDate) => {
  const currentDate = new Date();
  const postedDate = new Date(postDate);

  const timeDiffInMs = currentDate.getTime() - postedDate.getTime();

  const seconds = Math.floor(timeDiffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(months / 12);

  const remainingSeconds = seconds % 60;
  const remainingMinutes = minutes % 60;
  const remainingHours = hours % 24;
  const remainingDays = days % 30.44;

  const formattedTime = [];

  if (years > 0) {
    const prefix = years === 1 ? 'year' : 'years';
    formattedTime.push(`${years} ${prefix}`);
  }

  if (months > 0) {
    const prefix = months === 1 ? 'month' : 'months';
    formattedTime.push(`${months} ${prefix}`);
  }

  if (remainingDays > 0) {
    const prefix = remainingDays === 1 ? 'day' : 'days';
    formattedTime.push(`${remainingDays} ${prefix}`);
  }

  if (remainingHours > 0) {
    const prefix = remainingHours === 1 ? 'hour' : 'hours';
    formattedTime.push(`${remainingHours} ${prefix}`);
  }

  if (remainingMinutes > 0) {
    const prefix = remainingMinutes === 1 ? 'minute' : 'minutes';
    formattedTime.push(`${remainingMinutes} ${prefix}`);
  }

  if (remainingSeconds > 0) {
    const prefix = remainingSeconds === 1 ? 'second' : 'seconds';
    formattedTime.push(`${remainingSeconds} ${prefix}`);
  }

  return formattedTime.join(', ');
};

// function that returns how many days this year a listing been booked for
export const getDaysBooked = (bookings) => {
  let days = 0;
  const year = new Date().getFullYear();

  bookings.forEach((booking) => {
    const startDate = new Date(booking.start);
    const endDate = new Date(booking.end);

    if (startDate.getFullYear() === year && endDate.getFullYear() === year) {
      const daysDiff = (endDate - startDate) / (1000 * 60 * 60 * 24);
      days += daysDiff + 1; // add 1 to include both start and end days
    }
  });

  return days;
};

// function that takes in bookings and returns the profit
export const getProfit = (bookings) => {
  let profit = 0;

  bookings.forEach((booking) => {
    if (booking.status === 'accepted') {
      profit += booking.totalPrice;
    }
  });

  return profit;
};
