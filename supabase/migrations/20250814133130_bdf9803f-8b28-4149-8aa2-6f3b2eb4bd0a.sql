-- Remove the overly permissive RLS policies
DROP POLICY IF EXISTS "Allow reading reservations for calendar" ON public.reservations;
DROP POLICY IF EXISTS "Allow updating reservations" ON public.reservations;
DROP POLICY IF EXISTS "Allow deleting reservations" ON public.reservations;

-- Keep the public insert policy for new reservations (this is needed for the booking form)
-- "Anyone can create reservations" policy remains as-is

-- Create a secure view for calendar functionality that only exposes date ranges
CREATE OR REPLACE VIEW public.reservation_calendar AS
SELECT 
  id,
  arrival_date,
  departure_date,
  status
FROM public.reservations
WHERE status != 'cancelled';

-- Enable RLS on the view
ALTER VIEW public.reservation_calendar ENABLE ROW LEVEL SECURITY;

-- Allow public read access to the calendar view (only dates, no personal info)
CREATE POLICY "Public calendar access"
ON public.reservation_calendar
FOR SELECT
USING (true);

-- Create admin-only policies for full reservation access
-- Note: This requires authentication to be implemented later
CREATE POLICY "Admin can view all reservations"
ON public.reservations
FOR SELECT
USING (
  -- This will only work once authentication is implemented
  -- For now, no one can read the full reservation data
  false
);

CREATE POLICY "Admin can update reservations"
ON public.reservations
FOR UPDATE
USING (
  -- This will only work once authentication is implemented
  false
);

CREATE POLICY "Admin can delete reservations"
ON public.reservations
FOR DELETE
USING (
  -- This will only work once authentication is implemented
  false
);

-- Allow users to view their own reservations by email (for confirmation emails, etc.)
CREATE POLICY "Users can view own reservations by email"
ON public.reservations
FOR SELECT
USING (
  -- This allows users to query their own reservations using their email
  -- This is safer than exposing all data publicly
  email = current_setting('request.jwt.claims.email', true)
  OR
  -- Fallback for unauthenticated users - they cannot see any data
  false
);