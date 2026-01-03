import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { API_URL } from '../../config';
import './RestaurantsMap.css';

// Fix for default markers not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to handle map movements
function MapController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 13, {
        duration: 1.5
      });
    }
  }, [center, zoom, map]);

  return null;
}

const RestaurantsMap = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapCenter, setMapCenter] = useState([0, 0]); // Default to world center
  const [mapZoom, setMapZoom] = useState(2); // Start zoomed out
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    fetchRestaurants();
    getUserLocation();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [restaurants, showOpenOnly, searchTerm]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (initialLoad) {
            setMapCenter([position.coords.latitude, position.coords.longitude]);
            setMapZoom(13);
            setInitialLoad(false);
          }
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  };

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/client/restaurants`
      );

      const data = await response.json();

      if (data.status === 'success') {
        setRestaurants(data.data.restaurants);
      } else {
        throw new Error(data.message || 'Failed to fetch restaurants');
      }
    } catch (err) {
      console.error('Fetch restaurants error:', err);
      setError(err.message || 'Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const filterRestaurants = () => {
    let filtered = restaurants;

    if (showOpenOnly) {
      filtered = filtered.filter((r) => r.isOpen);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.address.toLowerCase().includes(term)
      );
    }

    setFilteredRestaurants(filtered);
  };

  const handleViewProducts = (restaurantId) => {
    navigate(`/browse?restaurant=${restaurantId}`);
  };

  const handleRestaurantClick = (restaurant) => {
    if (restaurant.latitude && restaurant.longitude) {
      setMapCenter([restaurant.latitude, restaurant.longitude]);
      setMapZoom(15);
      // Scroll to map
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Get valid restaurants with coordinates for map
  const restaurantsWithCoords = filteredRestaurants.filter(
    (r) => r.latitude && r.longitude
  );

  // Calculate map center based on filtered restaurants on initial load
  useEffect(() => {
    if (restaurantsWithCoords.length > 0 && initialLoad) {
      const avgLat =
        restaurantsWithCoords.reduce((sum, r) => sum + r.latitude, 0) /
        restaurantsWithCoords.length;
      const avgLng =
        restaurantsWithCoords.reduce((sum, r) => sum + r.longitude, 0) /
        restaurantsWithCoords.length;
      setMapCenter([avgLat, avgLng]);
      setMapZoom(10);
      setInitialLoad(false);
    }
  }, [restaurantsWithCoords.length, initialLoad]);

  if (loading) {
    return (
      <div className="restaurants-map-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="restaurants-map-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchRestaurants} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurants-map-page">
      <div className="restaurants-header">
        <h1>Restaurant Locations</h1>
        <p>Find restaurants near you offering discounted near-expiry products</p>
      </div>

      <div className="restaurants-controls">
        <div className="search-control">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-control">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showOpenOnly}
              onChange={(e) => setShowOpenOnly(e.target.checked)}
            />
            <span>Show open restaurants only</span>
          </label>
        </div>
      </div>

      {restaurantsWithCoords.length > 0 ? (
        <div className="map-container">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            style={{ height: '500px', width: '100%' }}
          >
            <MapController center={mapCenter} zoom={mapZoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {restaurantsWithCoords.map((restaurant) => (
              <Marker
                key={restaurant.id}
                position={[restaurant.latitude, restaurant.longitude]}
              >
                <Popup>
                  <div className="map-popup">
                    <h3>{restaurant.name}</h3>
                    {restaurant.logoUrl && (
                      <img
                        src={restaurant.logoUrl}
                        alt={restaurant.name}
                        className="popup-logo"
                      />
                    )}
                    <p className="popup-address">{restaurant.address}</p>
                    <p className="popup-phone">{restaurant.phone}</p>
                    <span
                      className={`popup-status ${
                        restaurant.isOpen ? 'open' : 'closed'
                      }`}
                    >
                      {restaurant.isOpen ? 'Open' : 'Closed'}
                    </span>
                    <button
                      onClick={() => handleViewProducts(restaurant.id)}
                      className="popup-btn"
                    >
                      View Products
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        <div className="empty-state">
          <p>No restaurants found with location coordinates</p>
        </div>
      )}

      <div className="restaurants-list">
        <h2>All Restaurants ({filteredRestaurants.length})</h2>
        {filteredRestaurants.length === 0 ? (
          <div className="empty-state">
            <p>No restaurants found matching your criteria</p>
          </div>
        ) : (
          <div className="restaurants-grid">
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="restaurant-card">
                {restaurant.logoUrl && (
                  <div className="restaurant-logo">
                    <img src={restaurant.logoUrl} alt={restaurant.name} />
                  </div>
                )}
                <div className="restaurant-info">
                  <h3>{restaurant.name}</h3>
                  {restaurant.description && (
                    <p className="restaurant-description">
                      {restaurant.description}
                    </p>
                  )}
                  <p className="restaurant-address">{restaurant.address}</p>
                  <p className="restaurant-phone">{restaurant.phone}</p>
                  <div className="restaurant-footer">
                    <span
                      className={`restaurant-status ${
                        restaurant.isOpen ? 'open' : 'closed'
                      }`}
                    >
                      {restaurant.isOpen ? 'Open' : 'Closed'}
                    </span>
                    <div className="restaurant-actions">
                      {restaurant.latitude && restaurant.longitude && (
                        <button
                          onClick={() => handleRestaurantClick(restaurant)}
                          className="location-btn"
                        >
                          View on Map
                        </button>
                      )}
                      <button
                        onClick={() => handleViewProducts(restaurant.id)}
                        className="products-btn"
                      >
                        View Products
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsMap;
