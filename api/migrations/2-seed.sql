
/* Some example data to seed the app for testing */

INSERT INTO 
  "bookings" ("createdDate", "bookingDate", "location", "username")
VALUES
  (NOW(), to_timestamp('Mon Nov 15 2021 00:00:00', 'Dy Mon DD YYYY HH24:MI:SS'), 'Victoria', 'will'),
  (NOW(), to_timestamp('Sun Nov 14 2021 00:00:00', 'Dy Mon DD YYYY HH24:MI:SS'), 'Vancouver', 'noel'),
  (NOW(), to_timestamp('Mon Nov 15 2021 00:00:00', 'Dy Mon DD YYYY HH24:MI:SS'), 'Vancouver', 'david');

INSERT INTO "bookings" ("createdDate", "bookingDate", "location", "username")
SELECT
  NOW() AS "createdDate",
  (NOW() + (random() * INTERVAL '60' DAY)) AS "bookingDate",
  CASE (random() * 9)::int
    WHEN 0 THEN 'Vancouver'
    WHEN 1 THEN 'Victoria'
    WHEN 2 THEN 'Calgary'
    WHEN 3 THEN 'Toronto'
    WHEN 4 THEN 'Montreal'
    WHEN 5 THEN 'Ottawa'
    WHEN 6 THEN 'Halifax'
    WHEN 7 THEN 'Winnipeg'
    WHEN 8 THEN 'Saskatoon'
    ELSE 'Regina'
  END AS "location",
  substr(md5(random()::text), 1, 8) AS "username"
FROM generate_series(1, 1000);
