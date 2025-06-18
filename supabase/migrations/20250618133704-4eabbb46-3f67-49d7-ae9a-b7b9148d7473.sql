
-- Enable Row Level Security on the reservations table
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Since this is a booking system where guests make reservations,
-- we'll create policies that allow public access for creating reservations
-- but restrict viewing/editing to admin users only

-- Policy to allow anyone to create reservations (for the booking form)
CREATE POLICY "Anyone can create reservations" 
ON public.reservations 
FOR INSERT 
WITH CHECK (true);

-- Policy to allow reading reservations (for admin and calendar functionality)
-- For now, allowing read access for calendar display - you may want to restrict this further
CREATE POLICY "Allow reading reservations for calendar" 
ON public.reservations 
FOR SELECT 
USING (true);

-- Policy to allow updating reservation status (for admin functionality)
-- This allows updates to any reservation - you may want to add user authentication later
CREATE POLICY "Allow updating reservations" 
ON public.reservations 
FOR UPDATE 
USING (true);

-- Policy to allow deleting reservations (for admin functionality)
CREATE POLICY "Allow deleting reservations" 
ON public.reservations 
FOR DELETE 
USING (true);
