import React from 'react';
import { Route, Routes, Navigate } from 'react-router';
import Header from './components/Header';
import BookingsList from './pages/BookingsList';
import CreateBooking from './pages/CreateBooking';

export default function App() {
  return (
    <div className="container" style={{fontFamily: 'Comic Sans, Comic Sans MS, cursive'}}>
      <Header/>
      <Routes>
        <Route path='/list' element={<BookingsList />}/>
        <Route path='/add' element={<CreateBooking />}/>
        <Route path='/*' element={<Navigate to='/list'/>}/>
      </Routes>
    </div>
  );
}
