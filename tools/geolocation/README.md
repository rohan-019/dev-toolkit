# Geolocation & Maps Tool

A modern, interactive geolocation tool that uses the browser's Geolocation API to find your current position and displays it on a beautiful map powered by Leaflet.js and CartoDB tiles.

## Features

- **Get Current Location**: One-click access to your current geographical position
- **Watch Position**: Continuously track your position in real-time (great for mobile devices)
- **Interactive Map**: Beautiful CartoDB Positron tiles with smooth zoom and pan
- **Accuracy Visualization**: Shows accuracy circle around your location marker
- **Detailed Information**: Displays latitude, longitude, accuracy, and altitude
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: User-friendly error messages for permission issues and timeouts

## How to Use

### Get Your Location Once

1. Click the **"Get My Location"** button
2. Allow location access when prompted by your browser
3. Your position will be displayed on the map with detailed coordinates

### Track Your Position Continuously

1. Click the **"Watch Position"** button
2. The map will update automatically as you move
3. Click **"Stop Watching"** to stop tracking

## Technical Details

### Technologies Used

- **Leaflet.js**: Open-source JavaScript library for interactive maps
- **CartoDB Positron**: Beautiful, minimalist map tiles
- **Geolocation API**: Browser API for accessing device location
- **HTML5/CSS3/JavaScript**: Modern web standards

### Map Features

- Zoom level: 17 (close-up view)
- Custom marker icon with FontAwesome
- Accuracy circle visualization
- Popup with coordinate information
- Responsive map sizing

### Geolocation Options

```javascript
{
  enableHighAccuracy: true,  // Use GPS if available
  timeout: 10000,            // 10 second timeout
  maximumAge: 0              // Don't use cached position
}
```

## Browser Compatibility

This tool works in all modern browsers that support:
- Geolocation API
- ES6 JavaScript
- CSS Grid/Flexbox

### Supported Browsers

- ✅ Chrome 50+
- ✅ Firefox 50+
- ✅ Safari 10+
- ✅ Edge 14+
- ✅ Opera 40+

## Privacy & Security

- Location data is **never stored** or transmitted to any server
- All processing happens locally in your browser
- Works over HTTPS for enhanced security
- You can revoke location permissions at any time in browser settings

## Use Cases

- Finding your current coordinates
- Testing geolocation features during development
- Tracking walking/hiking routes
- Mobile device location testing
- Learning about the Geolocation API

## Development

### File Structure

```
tools/geolocation/
├── index.html          # Main HTML file
├── script.js           # JavaScript functionality
├── leaflet/            # Leaflet.js library files
│   ├── leaflet.js
│   ├── leaflet.css
│   └── images/
└── README.md           # This file
```

### Key Functions

- `initMap()`: Initializes the Leaflet map
- `getLocation()`: Gets current position once
- `toggleWatchPosition()`: Starts/stops position tracking
- `updateMap(position)`: Updates marker and map view
- `handleLocationSuccess(position)`: Success callback
- `handleLocationError(error)`: Error handling

## Known Limitations

- Accuracy depends on device GPS capabilities
- Indoor locations may have lower accuracy
- Requires browser permission to access location
- Some browsers may not support `watchPosition` on desktop

## Contributing

This tool is part of the [DevToolkit](https://github.com/heysaiyad/dev-toolkit) project for Hacktoberfest 2025.

Contributions are welcome! Please follow the project's [contribution guidelines](../../CONTRIBUTING.md).

## License

This project is part of DevToolkit and is licensed under the MIT License.

## Credits

- **Leaflet.js**: [leafletjs.com](https://leafletjs.com/)
- **CartoDB**: [carto.com](https://carto.com/)
- **FontAwesome**: [fontawesome.com](https://fontawesome.com/)
- **DevToolkit**: Created by [Md Saiyad Ali](https://github.com/heysaiyad)

---

**Made with ❤️ for Hacktoberfest 2025**
