const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// GenieACS API endpoint
const GENIEACS_API = 'http://103.xx.xx.xx:7557';

app.post('/api/wifi-settings', async (req, res) => {
  try {
    const { pppoeUsername, ssid, password } = req.body;

    // Verify PPPoE username and get device ID
    const deviceResponse = await fetch(
      `${GENIEACS_API}/devices?query=InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.1.Username=${pppoeUsername}`
    );

    if (!deviceResponse.ok) {
      return res.status(404).json({ error: 'Invalid PPPoE username or device not found' });
    }

    const devices = await deviceResponse.json();
    if (!devices || devices.length === 0) {
      return res.status(404).json({ error: 'No device found with this PPPoE username' });
    }

    const deviceId = devices[0]._id;

    // Update WiFi settings
    const updateResponse = await fetch(`${GENIEACS_API}/devices/${deviceId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'setParameterValues',
        parameterValues: [
          ['InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID', ssid],
          ['InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey', password],
        ],
      }),
    });

    if (!updateResponse.ok) {
      return res.status(500).json({ error: 'Failed to update WiFi settings' });
    }

    const result = await updateResponse.json();
    console.log('GenieACS update response:', result);

    res.json({ success: true, message: 'WiFi settings updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
