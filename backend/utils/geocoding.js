const axios = require('axios');

/**
 * Geocode an address using OpenStreetMap Nominatim API
 * @param {string} address - The address to geocode
 * @returns {Promise<{latitude: number, longitude: number} | null>} - Coordinates or null if geocoding fails
 */
const geocodeAddress = async (address) => {
  try {
    if (!address || typeof address !== 'string' || address.trim().length === 0) {
      console.error('Invalid address provided for geocoding');
      return null;
    }

    // Nominatim API endpoint
    const nominatimUrl = 'https://nominatim.openstreetmap.org/search';

    // Make request to Nominatim API
    const response = await axios.get(nominatimUrl, {
      params: {
        q: address,
        format: 'json',
        limit: 1,
        addressdetails: 1,
      },
      headers: {
        'User-Agent': 'NearExpiryApp/1.0', // Required by Nominatim usage policy
      },
      timeout: 5000, // 5 second timeout
    });

    // Check if we got results
    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      const latitude = parseFloat(result.lat);
      const longitude = parseFloat(result.lon);

      // Validate coordinates
      if (
        !isNaN(latitude) &&
        !isNaN(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180
      ) {
        console.log(`Geocoded address "${address}" to (${latitude}, ${longitude})`);
        return {
          latitude,
          longitude,
        };
      } else {
        console.error('Invalid coordinates received from geocoding service');
        return null;
      }
    } else {
      console.warn(`No results found for address: ${address}`);
      return null;
    }
  } catch (error) {
    console.error('Geocoding error:', error.message);

    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      console.error('Geocoding request timed out');
    } else if (error.response) {
      console.error('Geocoding API error:', error.response.status, error.response.statusText);
    } else if (error.request) {
      console.error('No response received from geocoding service');
    }

    return null;
  }
};

module.exports = {
  geocodeAddress,
};
