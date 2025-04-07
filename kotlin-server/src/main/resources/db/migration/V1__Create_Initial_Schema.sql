-- Create enum types
CREATE TYPE user_type AS ENUM ('SELLER', 'BUYER');
CREATE TYPE deal_type AS ENUM ('SALE', 'INVESTMENT');
CREATE TYPE request_status AS ENUM ('NEW', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  user_type user_type NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  last_access TIMESTAMP,
  comments TEXT
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  deal_type deal_type NOT NULL,
  industry TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  contact_name1 TEXT,
  contact_phone1 TEXT,
  contact_position1 TEXT,
  contact_phone2 TEXT,
  inn TEXT,
  location TEXT,
  revenue TEXT,
  ebitda TEXT,
  price TEXT,
  sale_percent TEXT,
  website TEXT,
  hide_until_nda BOOLEAN DEFAULT FALSE,
  comments TEXT
);

-- Create requests table
CREATE TABLE IF NOT EXISTS requests (
  id SERIAL PRIMARY KEY,
  user_type user_type NOT NULL,
  topic TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  status request_status NOT NULL DEFAULT 'NEW',
  full_name TEXT NOT NULL,
  organization_name TEXT,
  cnum TEXT,
  login TEXT,
  phone TEXT,
  comments TEXT
);
