// API communication module

/**
 * Get all configured endpoints
 */
async function getAllEndpoints() {
  try {
    const response = await fetch("/api/endpoints");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.endpoints;
  } catch (error) {
    console.error("Error fetching endpoints:", error);
    showNotification("Failed to fetch endpoints", "error");
    return [];
  }
}

/**
 * Add a new endpoint
 */
async function addEndpoint(url, name, expectedStatus) {
  try {
    const response = await fetch("/api/endpoints", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
        name: name,
        expected_status: expectedStatus,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to add endpoint");
    }

    const data = await response.json();
    showNotification("Endpoint added successfully", "success");
    return data.endpoint;
  } catch (error) {
    console.error("Error adding endpoint:", error);
    showNotification(error.message, "error");
    throw error;
  }
}

/**
 * Check status of all endpoints
 */
async function checkAllEndpoints() {
  try {
    // Get all endpoints first
    const endpoints = await getAllEndpoints();

    if (endpoints.length === 0) {
      showNotification("No endpoints to check", "info");
      return [];
    }

    // Show loading spinner
    showLoadingSpinner(true);

    // Extract endpoint IDs
    const endpointIds = endpoints.map((ep) => ep.id);

    // Check status
    const response = await fetch("/api/check-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endpoint_ids: endpointIds,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Hide loading spinner
    showLoadingSpinner(false);

    return data.results;
  } catch (error) {
    console.error("Error checking endpoints:", error);
    showLoadingSpinner(false);
    showNotification("Failed to check endpoints", "error");
    return [];
  }
}
