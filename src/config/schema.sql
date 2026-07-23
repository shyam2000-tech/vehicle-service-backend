-- ENUMS
DO $$ BEGIN
    CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "OwnerType" AS ENUM ('VEHICLE_OWNER', 'WORKSHOP_OWNER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('WORKSHOP_OWNER', 'VEHICLE_OWNER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "AccountStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table User
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "full_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) UNIQUE NOT NULL,
    "phone" VARCHAR(20) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(20) DEFAULT 'USER',
    "primary_role" user_role,
    "account_status" "AccountStatus" DEFAULT 'ACTIVE',
    "avatar_url" TEXT,
    "last_login" TIMESTAMP,
    "total_spent" DECIMAL(14, 2) DEFAULT 0,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "users_total_spent_idx" ON "users"("total_spent");
CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users"("created_at");
CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users"("updated_at");
CREATE INDEX IF NOT EXISTS "users_deleted_at_idx" ON "users"("deleted_at");
CREATE INDEX IF NOT EXISTS "users_account_status_idx" ON "users"("account_status");

-- Table Workshop
CREATE TABLE IF NOT EXISTS "workshops" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "business_name" VARCHAR(150) NOT NULL,
    "contact_number" VARCHAR(20) NOT NULL,
    "email" VARCHAR(150),
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "rating" DECIMAL(3, 2) DEFAULT 0,
    "total_bookings" INTEGER DEFAULT 0,
    "total_earnings" DECIMAL(14, 2) DEFAULT 0,
    "account_status" "AccountStatus" DEFAULT 'PENDING',
    "is_available" BOOLEAN DEFAULT true,
    "subscription_id" UUID,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "workshops_email_idx" ON "workshops"("email");
CREATE INDEX IF NOT EXISTS "workshops_city_idx" ON "workshops"("city");
CREATE INDEX IF NOT EXISTS "workshops_state_idx" ON "workshops"("state");
CREATE INDEX IF NOT EXISTS "workshops_rating_idx" ON "workshops"("rating");
CREATE INDEX IF NOT EXISTS "workshops_total_bookings_idx" ON "workshops"("total_bookings");
CREATE INDEX IF NOT EXISTS "workshops_total_earnings_idx" ON "workshops"("total_earnings");
CREATE INDEX IF NOT EXISTS "workshops_account_status_idx" ON "workshops"("account_status");
CREATE INDEX IF NOT EXISTS "workshops_is_available_idx" ON "workshops"("is_available");
CREATE INDEX IF NOT EXISTS "workshops_subscription_id_idx" ON "workshops"("subscription_id");
CREATE INDEX IF NOT EXISTS "workshops_created_at_idx" ON "workshops"("created_at");

-- Table WorkshopService
CREATE TABLE IF NOT EXISTS "workshop_services" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "workshop_id" UUID NOT NULL REFERENCES "workshops"("id") ON DELETE CASCADE,
    "service_name" VARCHAR(150),
    "vehicle_type" VARCHAR(50),
    "latitude" DECIMAL(9, 6) NOT NULL,
    "longitude" DECIMAL(9, 6) NOT NULL,
    "price_range" VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS "workshop_services_workshop_id_idx" ON "workshop_services"("workshop_id");

-- Table Booking
CREATE TABLE IF NOT EXISTS "bookings" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "booking_number" VARCHAR(50) UNIQUE NOT NULL,
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "workshop_id" UUID NOT NULL REFERENCES "workshops"("id") ON DELETE CASCADE,
    "status" "BookingStatus" DEFAULT 'PENDING',
    "vehicle_type" VARCHAR(50) NOT NULL,
    "service_type" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "bookings_user_id_idx" ON "bookings"("user_id");
CREATE INDEX IF NOT EXISTS "bookings_workshop_id_idx" ON "bookings"("workshop_id");
CREATE INDEX IF NOT EXISTS "bookings_status_idx" ON "bookings"("status");
CREATE INDEX IF NOT EXISTS "bookings_vehicle_type_idx" ON "bookings"("vehicle_type");
CREATE INDEX IF NOT EXISTS "bookings_service_type_idx" ON "bookings"("service_type");
CREATE INDEX IF NOT EXISTS "bookings_created_at_idx" ON "bookings"("created_at");

-- Table Payment
CREATE TABLE IF NOT EXISTS "payments" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "booking_id" UUID UNIQUE NOT NULL REFERENCES "bookings"("id") ON DELETE CASCADE,
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "workshop_id" UUID NOT NULL REFERENCES "workshops"("id") ON DELETE CASCADE,
    "amount" DECIMAL(14, 2) NOT NULL,
    "status" "PaymentStatus" DEFAULT 'PENDING',
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "payments_booking_id_idx" ON "payments"("booking_id");
CREATE INDEX IF NOT EXISTS "payments_user_id_idx" ON "payments"("user_id");
CREATE INDEX IF NOT EXISTS "payments_workshop_id_idx" ON "payments"("workshop_id");
CREATE INDEX IF NOT EXISTS "payments_status_idx" ON "payments"("status");

-- Table Review
CREATE TABLE IF NOT EXISTS "reviews" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "booking_id" UUID NOT NULL REFERENCES "bookings"("id") ON DELETE CASCADE,
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "workshop_id" UUID NOT NULL REFERENCES "workshops"("id") ON DELETE CASCADE,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Subscription
CREATE TABLE IF NOT EXISTS "subscriptions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "workshop_id" UUID NOT NULL REFERENCES "workshops"("id") ON DELETE CASCADE,
    "plan_id" UUID,
    "status" VARCHAR(20) DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "subscriptions_workshop_id_idx" ON "subscriptions"("workshop_id");
CREATE INDEX IF NOT EXISTS "subscriptions_status_idx" ON "subscriptions"("status");

-- Table RewardTransaction
CREATE TABLE IF NOT EXISTS "reward_transactions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "owner_id" UUID NOT NULL,
    "owner_type" "OwnerType" NOT NULL,
    "balance" DECIMAL(14, 2) DEFAULT 0,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "reward_transactions_owner_id_idx" ON "reward_transactions"("owner_id");
CREATE INDEX IF NOT EXISTS "reward_transactions_owner_type_idx" ON "reward_transactions"("owner_type");
CREATE INDEX IF NOT EXISTS "reward_transactions_created_at_idx" ON "reward_transactions"("created_at");
