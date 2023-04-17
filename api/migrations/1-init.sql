CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "bookings" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "createdDate" TIMESTAMP NOT NULL,
  "bookingDate" TIMESTAMP NOT NULL,
  "location" VARCHAR(255) NOT NULL,
  "username" VARCHAR(15) NOT NULL,
  CHECK (location ~* '^[a-zA-Z0-9\_\,\-\s]{1,50}$'),
  CHECK (username ~* '^[a-zA-Z0-9\@\_]{1,50}$')
);


