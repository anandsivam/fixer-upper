import { axios } from '../common';
import { useEffect, useState } from 'react';
import { Booking } from '../common';
import BookingRow from '../components/BookingRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export default function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [sortByDate, setSortByDate] = useState<boolean>(false);
  const [filterByLocation, setFilterByLocation] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 10;

  useEffect(() => {
    let isMounted = true;
    axios
      .get('http://localhost:4000/api/getBookings')
      .then(({ data }) => {
        if (isMounted) {
          setBookings(data.bookings.slice(0, 100)); // Display a maximum of 100 rows
        }
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMsg(error.message);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  function handleDeleteBooking(id: string) {
    setBookings(bookings.filter((booking) => booking.id !== id));
  }

  function handleBookingError(error: string) {
    setErrorMsg(error);
  }

  function handleBookingSuccess(success: string) {
    setSuccessMsg(success);
    setTimeout(() => setSuccessMsg(''), 5000);
  }

  function handleSortByDate() {
    const sortedBookings = [...bookings].sort((a, b) => {
      if (sortByDate) {
        return new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime();
      } else {
        return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime();
      }
    });
    setSortByDate(!sortByDate);
    setBookings(sortedBookings);
  }

  function handleFilterByLocation(e: React.ChangeEvent<HTMLInputElement>) {
    setFilterByLocation(e.target.value);
  }

  function filterBookings() {
    if (filterByLocation === '') {
      return bookings;
    } else {
      return bookings.filter((booking) => booking.location.toLowerCase().includes(filterByLocation.toLowerCase()));
    }
  }

  function handleRefresh() {
    window.location.reload();
  }

  function handlePageClick(pageNumber: number) {
    setCurrentPage(pageNumber);
  }

  function getPaginationGroup() {
    const start = Math.floor((currentPage - 1) / 5) * 5;
    return new Array(5)
      .fill(undefined)
      .map((_, index) => start + index + 1)
      .filter((page) => page <= totalPages);
  }

  function getPaginatedBookings() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filterBookings().slice(startIndex, endIndex);
  }

  const totalPages = Math.ceil(filterBookings().length / itemsPerPage);

  return (
    <>
      <div className="row">
        <div className="col h4" onClick={handleSortByDate}>
          Booking Date
          <FontAwesomeIcon icon={faSort} className="ms-1" />
        </div>
        <div className="col h4">
          Booking Location
          <div className="input-group mt-1">
            <input
              type="text"
              className="form-control"
              placeholder="Filter by location"
              value={filterByLocation}
              onChange={handleFilterByLocation}
            />
            <button className="btn btn-outline-secondary" type="button">
              Filter
            </button>
          </div>
        </div>
        <div className="col h4">Booked By</div>
        <div className="col">
          <button className="btn btn-outline-secondary" onClick={handleRefresh}>
            Refresh
          </button>
        </div>
      </div>
  
      <div>
        {getPaginatedBookings().map((booking) => (
          <BookingRow
            key={booking.id}
            booking={booking}
            onDeleteBooking={handleDeleteBooking}
            onError={handleBookingError}
            onSuccess={handleBookingSuccess}
          />
        ))}
      </div>
      {errorMsg && (
        <div className="row">
          <div className="col alert alert-danger" id="error-message">
            {errorMsg}
          </div>
        </div>
      )}
      {successMsg && (
        <div className="row">
          <div className="col alert alert-success" id="success-message">
            {successMsg}
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-12">
          <nav>
            <ul className="pagination">
              <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageClick(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              {getPaginationGroup().map((pageNumber, index) => (
                <li
                  key={index}
                  className={`page-item${pageNumber === currentPage ? ' active' : ''}`}
                >
                  <button className="page-link" onClick={() => handlePageClick(pageNumber)}>
                    {pageNumber}
                  </button>
                </li>
              ))}
              <li
                className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageClick(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );  
}
