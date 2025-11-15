// Import necessary modules and functions from external libraries and our own project
import React from "react";

// Define a function component called MapProvider that takes a children prop
function MapProvider({ children }) {
  // Check if we're actually on a maps page
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const isOnMapsPage = currentPath.includes('/maps');

  // If not on a maps page, just return children without any Google Maps functionality
  if (!isOnMapsPage) {
    return <>{children}</>;
  }

  // Only import and use Google Maps when actually needed
  try {
    const { useJsApiLoader } = require("@react-google-maps/api");

    // Define a list of libraries to load from the Google Maps API
    const libraries = ["places", "drawing", "geometry"];

    // Load Google Maps API only when on maps page
    const { isLoaded: scriptLoaded, loadError } = useJsApiLoader({
      googleMapsApiKey: "AIzaSyCJM0a8oSaRMwxthozENQg1euRI51aNXJQ",
      libraries: libraries,
    });

    if (loadError) return <p>Encountered error while loading google maps</p>;

    if (!scriptLoaded) return <p>Map Script is loading ...</p>;

    // Return the children prop wrapped by this MapProvider component
    return <>{children}</>;
  } catch (error) {
    console.error('Error loading Google Maps:', error);
    return <p>Error loading maps functionality</p>;
  }
}

export { MapProvider };
