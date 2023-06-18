// Function to fetch location from GPS module
function fetchLocationFromGPS() {
    // Check if the browser supports Geolocation API
    if (navigator.geolocation) {
      // Get the current position from the GPS module
      navigator.geolocation.getCurrentPosition(
        function(position) {
          // Extract latitude and longitude coordinates
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
  
          // Call the function to send location data to the API
          sendLocationToAPI(latitude, longitude);
        },
        function(error) {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }
  
  // Function to send location data to the API
  function sendLocationToAPI(latitude, longitude) {
    // Construct the API request URL with appropriate parameters
    const apiURL = `http://api.ipapi.com/api/161.185.160.93?=${latitude}&lon=${longitude}&access_key=0d67295a6c372c6294948dfc59cc57d4lat`;
  
    // Make an HTTP request to the API
    fetch(apiURL)
      .then(response => response.json())
      .then(data => {
        // Process the API response data
        console.log("API response:", data);
        // Perform any additional actions with the data as needed
      })
      .catch(error => {
        console.error("Error sending location to API:", error);
      });
  }
  
  // Call the function to fetch location from the GPS module
  fetchLocationFromGPS();
  