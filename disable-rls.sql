-- Disable Row Level Security on submissions table to allow public access
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on campaigns table for public read access
ALTER TABLE campaigns DISABLE ROW LEVEL SECURITY;

-- Keep RLS enabled on admins table for security
-- ALTER TABLE admins ENABLE ROW LEVEL SECURITY;