
/**
 * Helper function to get the current subdomain from the URL
 */
export const getSubdomain = (): string | null => {
  const { hostname } = window.location;
  
  // Handle localhost development
  if (hostname === 'localhost' || hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    // Check if running on localhost with subdomain simulation
    const subdomain = new URLSearchParams(window.location.search).get('subdomain');
    return subdomain;
  }

  // Extract subdomain from the hostname
  const parts = hostname.split('.');
  
  if (parts.length > 2) {
    return parts[0];
  }
  
  return null;
};
