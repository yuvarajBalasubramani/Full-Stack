/**
 * Google Maps Integration Service
 * Handles map display and location tracking for orders
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * Load Google Maps script
 */
export const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });
};

/**
 * Initialize map
 */
export const initializeMap = (elementId, options = {}) => {
  const defaultOptions = {
    center: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi, India
    zoom: 12,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    ...options
  };

  const mapElement = document.getElementById(elementId);
  if (!mapElement) {
    throw new Error(`Map element with id "${elementId}" not found`);
  }

  return new window.google.maps.Map(mapElement, defaultOptions);
};

/**
 * Add marker to map
 */
export const addMarker = (map, position, options = {}) => {
  const defaultOptions = {
    position,
    map,
    animation: window.google.maps.Animation.DROP,
    ...options
  };

  return new window.google.maps.Marker(defaultOptions);
};

/**
 * Add custom marker with icon
 */
export const addCustomMarker = (map, position, iconUrl, title) => {
  return new window.google.maps.Marker({
    position,
    map,
    icon: {
      url: iconUrl,
      scaledSize: new window.google.maps.Size(40, 40)
    },
    title,
    animation: window.google.maps.Animation.DROP
  });
};

/**
 * Draw route between two points
 */
export const drawRoute = (map, origin, destination) => {
  return new Promise((resolve, reject) => {
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#4F46E5',
        strokeWeight: 5,
        strokeOpacity: 0.8
      }
    });

    const request = {
      origin,
      destination,
      travelMode: window.google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result);
        resolve({
          renderer: directionsRenderer,
          result
        });
      } else {
        reject(new Error(`Directions request failed: ${status}`));
      }
    });
  });
};

/**
 * Calculate distance between two points
 */
export const calculateDistance = (point1, point2) => {
  const lat1 = point1.lat;
  const lng1 = point1.lng;
  const lat2 = point2.lat;
  const lng2 = point2.lng;

  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance.toFixed(2); // Returns distance in km
};

const toRad = (value) => {
  return value * Math.PI / 180;
};

/**
 * Geocode address to coordinates
 */
export const geocodeAddress = (address) => {
  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng(),
          formattedAddress: results[0].formatted_address
        });
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
};

/**
 * Reverse geocode coordinates to address
 */
export const reverseGeocode = (lat, lng) => {
  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };
    
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results[0]) {
        resolve(results[0].formatted_address);
      } else {
        reject(new Error(`Reverse geocoding failed: ${status}`));
      }
    });
  });
};

/**
 * Get current location
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

/**
 * Create info window
 */
export const createInfoWindow = (content) => {
  return new window.google.maps.InfoWindow({
    content
  });
};

/**
 * Fit map to bounds
 */
export const fitMapToBounds = (map, locations) => {
  const bounds = new window.google.maps.LatLngBounds();
  locations.forEach(location => {
    bounds.extend(location);
  });
  map.fitBounds(bounds);
};

/**
 * Animate marker movement
 */
export const animateMarker = (marker, newPosition, duration = 1000) => {
  const startPosition = marker.getPosition();
  const startLat = startPosition.lat();
  const startLng = startPosition.lng();
  const endLat = newPosition.lat;
  const endLng = newPosition.lng;
  
  const startTime = Date.now();
  
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const currentLat = startLat + (endLat - startLat) * progress;
    const currentLng = startLng + (endLng - startLng) * progress;
    
    marker.setPosition({ lat: currentLat, lng: currentLng });
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  animate();
};