-- Enable extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create Trip table
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- Create UserLocation table
CREATE TABLE "UserLocation" (
    "userId" INTEGER NOT NULL,
    "tripId" INTEGER,

    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,

    "recordedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    "geom" geography(Point,4326)
    GENERATED ALWAYS AS (
        ST_SetSRID(
            ST_MakePoint(longitude, latitude),
            4326
        )::geography
    ) STORED,

    CONSTRAINT "UserLocation_pkey"
        PRIMARY KEY ("userId", "recordedAt")
);

-- Indexes
CREATE INDEX "Trip_userId_startedAt_idx"
ON "Trip"("userId", "startedAt");

CREATE INDEX "UserLocation_tripId_recordedAt_idx"
ON "UserLocation"("tripId", "recordedAt");

CREATE INDEX "UserLocation_geom_idx"
ON "UserLocation"
USING GIST ("geom");

-- Foreign keys
ALTER TABLE "Trip"
ADD CONSTRAINT "Trip_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "UserLocation"
ADD CONSTRAINT "UserLocation_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "UserLocation"
ADD CONSTRAINT "UserLocation_tripId_fkey"
FOREIGN KEY ("tripId")
REFERENCES "Trip"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- Convert to hypertable
SELECT create_hypertable(
    '"UserLocation"',
    by_range('recordedAt'),
    if_not_exists => TRUE
);

-- Spatial index
CREATE INDEX IF NOT EXISTS "UserLocation_geom_gist"
ON "UserLocation"
USING GIST ("geom");