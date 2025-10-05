// DOM Elements
const getLocationBtn = document.getElementById('getLocationBtn');
const watchToggleBtn = document.getElementById('watchToggleBtn');
const statusEl = document.getElementById('status');
const latitudeEl = document.getElementById('latitude');
const longitudeEl = document.getElementById('longitude');
const accuracyEl = document.getElementById('accuracy');
const altitudeEl = document.getElementById('altitude');

// Map and marker variables
let map;
let marker;
let accuracyCircle;
let watchId = null;
let isWatching = false;

// Initialize the map with CartoDB Positron tiles
function initMap() {
  // Default center (will be updated when location is found)
  map = L.map('map').setView([51.505, -0.09], 13);

  // Add CartoDB Positron tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);
}

// Update status message
function updateStatus(message, type = '') {
  statusEl.textContent = message;
  statusEl.className = 'status';
  if (type) {
    statusEl.classList.add(type);
  }
}

// Update location info display
function updateLocationInfo(position) {
  const { latitude, longitude, accuracy, altitude } = position.coords;

  latitudeEl.textContent = latitude.toFixed(6);
  longitudeEl.textContent = longitude.toFixed(6);
  accuracyEl.textContent = `${Math.round(accuracy)} m`;
  altitudeEl.textContent = altitude !== null ? `${Math.round(altitude)} m` : 'N/A';
}

// Update map with new location
function updateMap(position) {
  const { latitude, longitude, accuracy } = position.coords;
  const latLng = [latitude, longitude];

  // Remove existing marker and circle
  if (marker) {
    map.removeLayer(marker);
  }
  if (accuracyCircle) {
    map.removeLayer(accuracyCircle);
  }

  // Add new marker with custom icon
  marker = L.marker(latLng, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: '<i class="fas fa-location-dot" style="color: #ff6b35; font-size: 32px;"></i>',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    })
  }).addTo(map);

  // Add accuracy circle
  accuracyCircle = L.circle(latLng, {
    radius: accuracy,
    color: '#ff6b35',
    fillColor: '#ff6b35',
    fillOpacity: 0.1,
    weight: 2
  }).addTo(map);

  // Center map on location
  map.setView(latLng, 17);

  // Add popup to marker
  marker.bindPopup(`
    <strong>Your Location</strong><br>
    Lat: ${latitude.toFixed(6)}<br>
    Lng: ${longitude.toFixed(6)}<br>
    Accuracy: ${Math.round(accuracy)}m
  `).openPopup();
}

// Success callback for geolocation
function handleLocationSuccess(position) {
  updateStatus('Location found successfully!', 'success');
  updateLocationInfo(position);
  updateMap(position);
}

// Error callback for geolocation
function handleLocationError(error) {
  let message = 'Error getting location: ';

  switch(error.code) {
    case error.PERMISSION_DENIED:
      message += 'Permission denied. Please allow location access.';
      break;
    case error.POSITION_UNAVAILABLE:
      message += 'Location information unavailable.';
      break;
    case error.TIMEOUT:
      message += 'Request timed out. Please try again.';
      break;
    default:
      message += 'An unknown error occurred.';
  }

  updateStatus(message, 'error');
}

// Get current location once
function getLocation() {
  if (!navigator.geolocation) {
    updateStatus('Geolocation is not supported by your browser', 'error');
    return;
  }

  updateStatus('Getting your location...', 'loading');
  getLocationBtn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      handleLocationSuccess(position);
      getLocationBtn.disabled = false;
    },
    (error) => {
      handleLocationError(error);
      getLocationBtn.disabled = false;
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

// Toggle watching position
function toggleWatchPosition() {
  if (!navigator.geolocation) {
    updateStatus('Geolocation is not supported by your browser', 'error');
    return;
  }

  if (isWatching) {
    // Stop watching
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    isWatching = false;
    updateStatus('Stopped watching position', 'success');
    updateWatchButton();
  } else {
    // Start watching
    updateStatus('Watching your position...', 'loading');
    isWatching = true;
    updateWatchButton();

    watchId = navigator.geolocation.watchPosition(
      handleLocationSuccess,
      handleLocationError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }
}

// Update watch button appearance
function updateWatchButton() {
  if (!watchToggleBtn) return;

  const icon = watchToggleBtn.querySelector('i');
  const text = watchToggleBtn.querySelector('.btn-text');

  if (isWatching) {
    icon.className = 'fas fa-stop';
    if (text) text.textContent = 'Stop Watching';
    watchToggleBtn.classList.add('watching');
  } else {
    icon.className = 'fas fa-map-pin';
    if (text) text.textContent = 'Watch Position';
    watchToggleBtn.classList.remove('watching');
  }
}

// Event listeners
getLocationBtn.addEventListener('click', getLocation);
watchToggleBtn.addEventListener('click', toggleWatchPosition);

// Initialize map on page load
initMap();
