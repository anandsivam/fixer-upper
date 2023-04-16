import { useState, useEffect } from "react";
import { axios } from "../common";
import moment from "moment-timezone"

export default function CreateBooking() {
  const [locations, setLocations] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  useEffect(() => {
    axios.get("http://localhost:4000/api/getBookingLocations")
      .then(({ data }) => {
        setLocations(data);
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg("Error occurred while fetching booking locations");
      });
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  
    setErrorMsg("");
    setSuccessMsg("");
  
    const form = event.currentTarget;
    const formData = new FormData(form);
  
    const bookingDate = moment.tz(formData.get("date") as string, formData.get("time-zone") as string).toDate();
    const username = formData.get("booked-by") as string;
    const location = formData.get("location");

    const currentDate = new Date();
    if (bookingDate.getTime() === currentDate.getTime()) {
      setErrorMsg("Please contact us or call us to book for present day bookings!");
      form.reset();
      return;
    }
    if (bookingDate < currentDate) {
      setErrorMsg("Cannot book in the past!");
      form.reset();
      return; // Do not proceed with submission if there are errors
    }
  
    axios
      .post("http://localhost:4000/api/addBooking", { bookingDate, username, location })
      .then(({ data }) => {
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          setSuccessMsg(data.message);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.error) {
          setErrorMsg(error.response.data.error);
        } else {
          setErrorMsg("Error occurred while creating the booking");
        }
      });
  }
  
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col h4">Booking Location</div>
        <div className="col">
          <select name="location" required onInvalid={() => {setErrorMsg("Please select a location")}}>
            <option value="">None</option>
            {locations.map((loc) => {
              return (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              );
            })}
          </select>
          <div className="invalid-feedback">Please select a location</div>
        </div>
      </div>
      <div className="row">
        <div className="col h4">Booking Date</div>
        <div className="col">
          <input type="date" name="date" required onInvalid={() => {setErrorMsg("Please enter a valid date")}}/>
          <div className="invalid-feedback">Please enter a valid future date</div>
        </div>
      </div>
      <div className="row">
        <div className="col h4">Booked By</div>
        <div className="col">
          <input type="text" name="booked-by" maxLength={40} required onInvalid={() => {setErrorMsg("Invalid username format. Only uppercase, lowercase, @, _, -, and spaces are allowed, up to 40 characters.")}}/>
          <div className="invalid-feedback">Invalid username format. Only uppercase, lowercase, @, _, -, and spaces are allowed, up to 40 characters.</div>
        </div>
      </div>
      <div className="row">
        <div className="col"></div>
        <div className="col">
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col alert alert-danger" style={{ display: errorMsg ? "block" : "none" }}>
          {errorMsg}
        </div>
      </div>
      <div className="row">
        <div className="col alert alert-success" style={{ display: successMsg ? "block" : "none" }}>
          {successMsg}
        </div>
      </div>
    </form>
  );
}
