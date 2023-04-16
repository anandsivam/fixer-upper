
/* Some example data to seed the app for testing */

INSERT INTO 
  "bookings" ("id", "createdDate", "bookingDate", "location", "username")
VALUES
  ('1', NOW(), 'Mon Nov 15 2021 00:00:00', 'Victoria', 'will'),
  ('2', NOW(), 'Sun Nov 14 2021 00:00:00', 'Vancouver', 'noel'),
  ('3', NOW(), 'Mon Nov 15 2021 00:00:00', 'Vancouver', 'david');
