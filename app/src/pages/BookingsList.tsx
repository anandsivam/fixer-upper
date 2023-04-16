import { axios } from '../common'
import { useEffect, useState } from 'react'
import { Booking } from '../common'
import moment from 'moment'


export default function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  
  axios
    .get('http://localhost:4000/api/getBookings')
    .then(({ data }) => {
      setBookings(data)
    })

  return <>
    <div className="row">
      <div className="col h4">
        Booking Date
      </div>
      <div className="col h4">
        Booking Location
      </div>
      <div className="col h4">
        Booked By
      </div>
      <div className="col"></div>
    </div>
    {bookings.map((booking) => {
      return (<div className="row" style={{border: "1px solid black"}}>
        <div className="col">
          {moment(booking.bookingDate).toDate().toDateString()}
        </div>
        <div className="col">
          {booking.location}
        </div>
        <div className="col">
          {booking.username}
        </div>
        <div 
          className="col btn btn-success" 
          onClick={() => {
            axios
              .get(`/deleteBooking?id=${booking.id}`)
          }}> 
          Delete
        </div>
      </div>)
    })}
  </>
}
