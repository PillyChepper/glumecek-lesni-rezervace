
import { startOfDay } from 'date-fns';

// IMPORTANT: This file is now deprecated and not used in the application.
// The application now only uses dates from the Supabase database.
// This file is kept for reference purposes only.

export const sampleBookedDates = [
  // May 2025 bookings
  new Date(2025, 4, 10), // May 10, 2025
  new Date(2025, 4, 11), // May 11, 2025
  new Date(2025, 4, 12), // May 12, 2025
  new Date(2025, 4, 13), // May 13, 2025
  new Date(2025, 4, 20), // May 20, 2025
  new Date(2025, 4, 21), // May 21, 2025
  new Date(2025, 4, 22), // May 22, 2025
  
  new Date(2025, 4, 25, 0, 0, 0, 0), // May 25, 2025
  
  new Date(2025, 4, 26), // May 26, 2025
  new Date(2025, 4, 27), // May 27, 2025
  
  // June 2025 bookings
  new Date(2025, 5, 5),  // June 5, 2025
  new Date(2025, 5, 6),  // June 6, 2025
  new Date(2025, 5, 7),  // June 7, 2025
  new Date(2025, 5, 15), // June 15, 2025
  new Date(2025, 5, 16), // June 16, 2025
  new Date(2025, 5, 17), // June 17, 2025
  new Date(2025, 5, 29), // June 29, 2025
  new Date(2025, 5, 30), // June 30, 2025
  
  // July 2025 bookings
  new Date(2025, 6, 1),  // July 1, 2025
  new Date(2025, 6, 2),  // July 2, 2025
  new Date(2025, 6, 3),  // July 3, 2025
  new Date(2025, 6, 4),  // July 4, 2025
  new Date(2025, 6, 25), // July 25, 2025
  new Date(2025, 6, 26), // July 26, 2025
  new Date(2025, 6, 27), // July 27, 2025
  new Date(2025, 6, 28), // July 28, 2025
];

// DEPRECATED: This function is no longer used in the application.
export function getBookedDates(): Date[] {
  return sampleBookedDates.map(date => startOfDay(new Date(date)));
}
