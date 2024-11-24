import React from "react";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";

// Map container styling
const mapContainerStyle = {
  minWidth: "250px",
  height: "200px", // Adjust height as needed
};

export default function GoogleMapComponent({ location }) {
  const center = location;

  const markerPosition = location;
  const options = {
    disableDefaultUI: true, // Disable default UI controls
    zoomControl: true, // Enable zoom control
  };
  // Load the Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Replace with your API key
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={14} // Adjust zoom level as needed
      center={center}
      options={options}
    >
      {/* Marker */}
      <MarkerF
        position={markerPosition}
        // Add any desired options here
      />
      {/* <Marker position={markerPosition} /> */}
    </GoogleMap>
  );
}
