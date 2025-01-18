interface WifiResponse {
  success: boolean;
  message: string;
}

export const updateWifiSettings = async (
  pppoeUsername: string,
  ssid: string,
  password: string
): Promise<WifiResponse> => {
  console.log("Sending request to GenieACS API...");
  
  // Replace with your GenieACS API endpoint
  const API_URL = "YOUR_GENIEACS_API_ENDPOINT";
  
  try {
    // First, verify the PPPoE username and get the device ID
    const deviceResponse = await fetch(`${API_URL}/devices?query=InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.Username=${pppoeUsername}`);
    
    if (!deviceResponse.ok) {
      throw new Error("Invalid PPPoE username or device not found");
    }

    const devices = await deviceResponse.json();
    if (!devices || devices.length === 0) {
      throw new Error("No device found with this PPPoE username");
    }

    const deviceId = devices[0]._id;

    // Update WiFi settings for the found device
    const response = await fetch(`${API_URL}/devices/${deviceId}/wifi-settings`, {
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