interface WifiResponse {
  success: boolean;
  message: string;
}

export const updateWifiSettings = async (ssid: string, password: string): Promise<WifiResponse> => {
  console.log("Sending request to GenieACS API...");
  
  // Replace with your GenieACS API endpoint
  const API_URL = "YOUR_GENIEACS_API_ENDPOINT";
  
  try {
    const response = await fetch(`${API_URL}/devices/wifi-settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Add any required authentication headers
      },
      body: JSON.stringify({
        ssid,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("GenieACS API response:", data);
    
    return {
      success: true,
      message: "WiFi settings updated successfully",
    };
  } catch (error) {
    console.error("GenieACS API error:", error);
    throw error;
  }
};