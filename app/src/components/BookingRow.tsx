import moment from "moment";
import { useState } from "react"
import { Booking, axios } from "../common";

type BookingRowProps = {
    booking: Booking;
    onDeleteBooking: (id: string) => void;
    onError: (errorMsg: string) => void;
    onSuccess: (successMsg: string) => void;
  };

export default function BookingRow({ booking, onDeleteBooking, onError, onSuccess }: BookingRowProps) {
  
    const [isDeleting, setIsDeleting] = useState(false);

    function handleDelete() {
      setIsDeleting(true);
      axios.get(`/deleteBooking?id=${booking.id}`)
        .then(({ data }) => {
          if (data.error) {
            onError(data.error);
          } else {
            onSuccess(data.message);
            onDeleteBooking(booking.id);
          }
        })
        .finally(() => setIsDeleting(false));
    }

    return (
        <div className="row" style={{border: "1px solid black"}}>
          <div className="col">
            {moment(booking.bookingDate).toDate().toDateString()}
          </div>
          <div className="col">
            {booking.location}
          </div>
          <div className="col">
            {booking.username}
          </div>
          <div className="col">
            <button
              className="btn btn-success"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      );
}
