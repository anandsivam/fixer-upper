
import Axios from 'axios'
import axiosRetry from 'axios-retry';

export interface Booking {
  id: string
  username: string
  bookingDate: string
  createdDate: string
  location: string
}

export const axios = Axios.create({ baseURL: 'http://localhost:4000/api' })
axiosRetry(axios, { retries: 5 });
