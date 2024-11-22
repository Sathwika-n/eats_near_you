import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

// Map container styling
const mapContainerStyle = {
  width: "100%",
  height: "400px", // Adjust height as needed
};

// Initial center coordinates
const center = {
  lat: 37.7749, // Latitude
  lng: -122.4194, // Longitude
};

// Example marker position
const markerPosition = {
  lat: 37.7749, // Latitude
  lng: -122.4194, // Longitude
};
const options = {
  disableDefaultUI: true, // Disable default UI controls
  zoomControl: true, // Enable zoom control
};
export default function GoogleMapComponent() {
  // Load the Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCwHWPmFhELoeCWKVdVJXDCGUKOwtBHDcE", // Replace with your API key
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={12} // Adjust zoom level as needed
      center={center}
      options={options}
    >
      {/* Marker */}
      <Marker position={markerPosition} />
    </GoogleMap>
  );
}
