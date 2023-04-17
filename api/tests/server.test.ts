import request from 'supertest';
import { BookingLocations } from '../src/BookingLocations';
import {app} from '../src/server';

describe('API endpoints', () => {
  describe('GET /api/getBookingLocations', () => {
    it('should return all booking locations', async () => {
      const response = await request(app).get('/api/getBookingLocations');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(Object.values(BookingLocations));
    });
  });

  describe('GET /api/getBookings', () => {
    it('should return the first page of bookings', async () => {
      const response = await request(app).get('/api/getBookings');

      expect(response.status).toBe(200);
      expect(response.body.bookings.length).toBeGreaterThan(0);
      expect(response.body.totalPages).toBeGreaterThan(0);
      expect(response.body.currentPage).toBe(1);
    });
  });

  describe('POST /api/addBooking', () => {
    it('should add a new booking', async () => {
      const newBooking = {
        bookingDate: new Date(),
        username: 'testuser',
        location: BookingLocations[0]
      };

      const response = await request(app)
        .post('/api/addBooking')
        .send(newBooking);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Booking Created!');
    });

    it('should return an error if the booking already exists', async () => {
      const existingBooking = {
        bookingDate: new Date(),
        username: 'testuser',
        location: BookingLocations[0]
      };

      const response1 = await request(app)
        .post('/api/addBooking')
        .send(existingBooking);

      const response2 = await request(app)
        .post('/api/addBooking')
        .send(existingBooking);

      expect(response2.status).toBe(409);
      expect(response2.body.error).toContain('Booking already exists');
    });

    it('should return an error if the booking location is not available', async () => {
      const invalidBooking = {
        bookingDate: new Date(),
        username: 'testuser',
        location: 'invalid-location'
      };

      const response = await request(app)
        .post('/api/addBooking')
        .send(invalidBooking);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Booking not available');
    });
  });

  describe('GET /api/deleteBooking', () => {
    it('should delete a booking', async () => {
      const newBooking = {
        bookingDate: new Date(),
        username: 'testuser',
        location: BookingLocations[0]
      };

      const addResponse = await request(app)
        .post('/api/addBooking')
        .send(newBooking);

      const deleteResponse = await request(app)
        .get(`/api/deleteBooking?id=${addResponse.body.id}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.message).toBe('Booking Deleted!');
    });
  });
});
