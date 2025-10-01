-- Supabase Database Setup Script
-- Run this in your Supabase SQL Editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    rules TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "endTime" TIMESTAMP WITH TIME ZONE,
    "winnerSelected" BOOLEAN DEFAULT false,
    "winnerHash" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create submissions table
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "entryCount" INTEGER DEFAULT 1,
    "isVerified" BOOLEAN DEFAULT false,
    "verificationHash" TEXT,
    "tweetUrl" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "campaignId" UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE
);

-- Create admins table
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_campaigns_isActive ON campaigns("isActive");
CREATE INDEX idx_campaigns_createdAt ON campaigns("createdAt");

CREATE INDEX idx_submissions_campaignId ON submissions("campaignId");
CREATE INDEX idx_submissions_isVerified ON submissions("isVerified");
CREATE INDEX idx_submissions_createdAt ON submissions("createdAt");
CREATE INDEX idx_submissions_entryCount ON submissions("entryCount");

CREATE INDEX idx_admins_username ON admins(username);
CREATE INDEX idx_admins_email ON admins(email);

-- Create unique constraints
ALTER TABLE submissions ADD CONSTRAINT unique_email_campaign UNIQUE (email, "campaignId");
ALTER TABLE submissions ADD CONSTRAINT unique_wallet_campaign UNIQUE ("walletAddress", "campaignId");

-- Create function to automatically update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updatedAt
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to campaigns (read-only)
CREATE POLICY "Allow public read access to active campaigns" ON campaigns
    FOR SELECT USING ("isActive" = true);

-- Create policies for submissions (users can insert their own, admins can read all)
CREATE POLICY "Allow public insert on submissions" ON submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to read their own submissions" ON submissions
    FOR SELECT USING (auth.uid()::text = "walletAddress" OR auth.role() = 'admin');

-- Create policies for admins (only authenticated admins can access)
CREATE POLICY "Allow admin access to admins table" ON admins
    FOR ALL USING (auth.role() = 'admin');