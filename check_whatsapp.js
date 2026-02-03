const fetch = require('node-fetch'); // Assuming node-fetch is available or using built-in fetch in newer node

const BASE_URL = 'https://evolution-api-production-5853.up.railway.app';
const API_KEY = '6b4e03423667dbb73b6e15454f0eb1abd4597f9a1b078e3f5b5a6bc7';
const INSTANCE_NAME = 'AdminPediaAI';

async function checkStatus() {
  try {
    const response = await fetch(`${BASE_URL}/instance/connectionState/${INSTANCE_NAME}`, {
      headers: {
        'apikey': API_KEY,
      },
    });
    
    const data = await response.json();
    console.log('Status Response:', JSON.stringify(data, null, 2));
    
    const instancesRes = await fetch(`${BASE_URL}/instance/fetchInstances`, {
      headers: {
        'apikey': API_KEY,
      },
    });
    const instances = await instancesRes.json();
    console.log('All Instances:', JSON.stringify(instances, null, 2));

  } catch (error) {
    console.error('Error:', error);
  }
}

checkStatus();
