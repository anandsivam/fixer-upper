CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "bookings" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "createdDate" TIMESTAMP NOT NULL,
  "bookingDate" TIMESTAMP NOT NULL,
  "location" VARCHAR(255) NOT NULL,
  "username" VARCHAR(15) NOT NULL,
  CHECK (location ~* '^[a-z]+$'::text),
  CHECK (username ~* '^[\w@]+$'::text)
);
