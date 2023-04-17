import express from 'express'
import cors from 'cors'
import connect from './db'
import { v4 as uuid } from 'uuid'
import axios from 'axios'
import { BookingLocations } from './BookingLocations'

export const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors())

const api = express.Router()

api.get('/getBookingLocations', (req, res) => {
  
  res.json(Object.values(BookingLocations));
});

api.get('/getBookings', async (req, res) => {
  const db = await connect();
  const rowsPerPage = 100;
  const page = parseInt(req.query.page?.toString() || '1');

  try {
    const { rows } = await db.query(`
      SELECT *
      FROM bookings
      LIMIT $1
      OFFSET $2
    `, [rowsPerPage, (page - 1) * rowsPerPage]);

    const totalCount = await db.query('SELECT COUNT(*) FROM bookings');
    const totalRows = parseInt(totalCount.rows[0].count);

    const totalPages = Math.ceil(totalRows / rowsPerPage);

    res.json({
      bookings: rows,
      totalPages,
      currentPage: page,
    });
  } catch (ex) {
    res.json({ error: `Database Error!`, ...ex });
  }
});


api.post('/addBooking', async (req, res) => {
  const db = await connect();
  
  try {
    const { bookingDate, username, location } = req.body;

    const { data: locations } = await axios.get('http://localhost:4000/api/getBookingLocations');

    if (!locations.includes(location)) {
      res.status(400).json({ error: `Booking not available in ${location}. Please contact us for further assistance.` });
      return;
    }

    // Use parameterized values in the query
    const { rows: existing } = await db.query(`SELECT * FROM bookings WHERE "bookingDate" = $1 AND "location" = $2`, [bookingDate, location]);

    if (existing.length > 0) {
      res.status(409).json({ error: `Booking already exists for the Booking date ${bookingDate} on the selected location ${location}!` });
      return;
    }    

    let id;
    (async () => {
      do {
        id = uuid();
      } while (!(await db.query(`SELECT * FROM bookings WHERE "id" = $1`, [id])).rowCount);
    })();

    await db.query(`INSERT INTO bookings ("id", "createdDate", "bookingDate", "location", "username") VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4)`, [id, bookingDate, location, username]);

    res.json({ message: 'Booking Created!' });
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: `Database Error!`, ...ex });
  }
});


api.get('/deleteBooking', async (req, res) => {
  const db = await connect();
  // Catch errors
  try {
    await db.query(`DELETE FROM bookings WHERE "id"='${req.query.id}'`)
    res.json({ message: 'Booking Deleted!' })
  } catch (ex) {
    res.json({ error: `Database Error when deleteing the booking id ${req.query.id}!`, ...ex })
  }
})

app.use('/api', api)
app.listen(4000, () => {
  console.log('server started on port 4000')
});
