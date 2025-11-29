# Google Maps Integration Setup Guide

## Overview
The Smart Traffic Management System includes advanced Google Maps integration for real-time traffic data, route optimization, and interactive mapping features.

## Features Enabled by Google Maps

### 🗺️ Real-time Traffic Layer
- Live traffic conditions overlay
- Color-coded congestion levels (green/yellow/red)
- Traffic flow speed indicators
- Incident markers (accidents, construction, road closures)

### 📍 Interactive Markers
- Traffic signal locations with status indicators
- Click markers for detailed information
- Custom styled markers matching signal status (red/yellow/green)
- Info windows with signal timing and mode

### 🚗 Route Intelligence
- Optimal route calculation based on current traffic
- Alternative route suggestions
- Real-time ETA updates
- Distance and duration estimates

### 📊 Traffic Analytics
- Historical traffic patterns
- Peak hour identification
- Congestion predictions
- Travel time analysis

## Setup Instructions

### Step 1: Get Google Maps API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (or select existing)
   - Click "Select a project" → "New Project"
   - Enter project name: "Traffic Management System"
   - Click "Create"

3. **Enable Required APIs**
   Navigate to "APIs & Services" → "Library" and enable:
   - ✅ Maps JavaScript API
   - ✅ Places API
   - ✅ Directions API
   - ✅ Distance Matrix API (optional)
   - ✅ Geocoding API (optional)

4. **Create API Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key

5. **Secure Your API Key** (Recommended)
   - Click on your API key to edit
   - Under "Application restrictions":
     - Select "HTTP referrers (web sites)"
     - Add your domain: `https://yourdomain.com/*`
     - For development: `http://localhost:*`
   - Under "API restrictions":
     - Select "Restrict key"
     - Choose the APIs you enabled above
   - Click "Save"

### Step 2: Configure Your Application

1. **Copy Environment File**
   ```bash
   cp .env.example .env
   ```

2. **Add Your API Key**
   Open `.env` and add your Google Maps API key:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

3. **Restart Development Server**
   ```bash
   npm run dev
   ```

### Step 3: Verify Integration

1. Navigate to **Advanced Traffic** page
2. You should see:
   - Interactive Google Map with dark theme
   - Real-time traffic layer (color-coded roads)
   - Traffic signal markers at intersections
   - Clickable markers with info windows

## API Usage and Costs

### Free Tier
Google Maps provides a generous free tier:
- **$200 free credit per month**
- Maps JavaScript API: ~28,000 loads/month free
- Directions API: ~40,000 requests/month free

### Cost Optimization Tips
1. **Restrict API Key**: Only allow necessary APIs
2. **Set Usage Limits**: Configure daily quotas in Google Cloud Console
3. **Cache Results**: Store frequently accessed data
4. **Lazy Loading**: Load maps only when needed

## Features by Page

### Dashboard
- Overview map with signal markers
- Traffic flow indicators
- Quick status view

### Advanced Traffic Page
- **Live Map Tab**
  - Full Google Maps integration
  - Real-time traffic layer
  - Interactive signal markers
  - Traffic flow statistics

- **Analytics Tab**
  - Route optimization suggestions
  - Traffic predictions
  - Incident reports
  - Performance metrics

- **Route Planning Tab**
  - Multi-route comparison
  - ETA calculations
  - Alternative path suggestions
  - Traffic-aware routing

## Customization Options

### Map Styling
Edit `src/components/common/GoogleTrafficMap.tsx`:
```typescript
styles: [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [{ color: '#1a2332' }] // Dark background
  },
  // Add more style rules...
]
```

### Marker Icons
Customize marker appearance:
```typescript
icon: {
  path: google.maps.SymbolPath.CIRCLE,
  fillColor: markerColor,
  fillOpacity: 1,
  strokeColor: '#ffffff',
  strokeWeight: 2,
  scale: 10,
}
```

### Traffic Layer Options
```typescript
const trafficLayer = new google.maps.TrafficLayer();
trafficLayer.setOptions({
  autoRefresh: true,
  // Additional options...
});
```

## Troubleshooting

### Map Not Loading
**Problem**: Blank map or error message
**Solutions**:
1. Check API key is correctly set in `.env`
2. Verify APIs are enabled in Google Cloud Console
3. Check browser console for error messages
4. Ensure API key restrictions allow your domain

### Traffic Layer Not Showing
**Problem**: No traffic colors on roads
**Solutions**:
1. Verify Maps JavaScript API is enabled
2. Check if traffic data is available for your region
3. Try toggling traffic layer on/off
4. Zoom in closer to see traffic details

### API Key Errors
**Problem**: "This API key is not authorized..."
**Solutions**:
1. Check API restrictions in Google Cloud Console
2. Verify HTTP referrer restrictions
3. Ensure all required APIs are enabled
4. Wait a few minutes after creating/updating key

### Quota Exceeded
**Problem**: "You have exceeded your daily request quota"
**Solutions**:
1. Check usage in Google Cloud Console
2. Set up billing if needed
3. Implement caching to reduce requests
4. Optimize API calls

## Advanced Features

### Custom Traffic Incidents
Add custom incident markers:
```typescript
const incidentMarker = new google.maps.Marker({
  position: { lat: 40.7580, lng: -73.9855 },
  map: map,
  icon: {
    url: 'path/to/incident-icon.png',
    scaledSize: new google.maps.Size(32, 32)
  }
});
```

### Route Directions
Implement turn-by-turn directions:
```typescript
const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();

directionsService.route({
  origin: startLocation,
  destination: endLocation,
  travelMode: google.maps.TravelMode.DRIVING,
  drivingOptions: {
    departureTime: new Date(),
    trafficModel: 'bestguess'
  }
}, (result, status) => {
  if (status === 'OK') {
    directionsRenderer.setDirections(result);
  }
});
```

### Traffic Predictions
Get predicted travel times:
```typescript
const distanceMatrixService = new google.maps.DistanceMatrixService();

distanceMatrixService.getDistanceMatrix({
  origins: [origin],
  destinations: [destination],
  travelMode: google.maps.TravelMode.DRIVING,
  drivingOptions: {
    departureTime: new Date(Date.now() + 3600000), // 1 hour from now
    trafficModel: 'pessimistic'
  }
}, (response, status) => {
  // Handle predicted travel time
});
```

## Best Practices

1. **Error Handling**: Always handle API errors gracefully
2. **Loading States**: Show loading indicators while map loads
3. **Responsive Design**: Ensure map works on all screen sizes
4. **Performance**: Limit number of markers for better performance
5. **User Privacy**: Don't track user location without permission
6. **Accessibility**: Provide alternative text and keyboard navigation

## Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Traffic Layer Guide](https://developers.google.com/maps/documentation/javascript/trafficlayer)
- [Directions API](https://developers.google.com/maps/documentation/javascript/directions)
- [Places API](https://developers.google.com/maps/documentation/javascript/places)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Google Maps API documentation
3. Check browser console for error messages
4. Verify API key configuration

---

**Note**: The system works without Google Maps API key using the custom SVG-based map. Google Maps integration is optional but provides enhanced real-time traffic data and advanced features.
