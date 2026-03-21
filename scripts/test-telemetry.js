import fetch from 'node-fetch';

const SOCIAL_URL = 'http://localhost:3003';
const MOCK_USER = 'test-user-123';

async function testTelemetry() {
  console.log('--- Testing Telemetry ---');

  // 1. Send Telemetry
  const sendRes = await fetch(`${SOCIAL_URL}/telemetry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: MOCK_USER,
      latitude: 41.57,
      longitude: 2.26, // Montmeló coordinates
      timestamp: new Date().toISOString()
    })
  });

  const sendData = await sendRes.json();
  console.log('POST /telemetry:', sendData);

  if (sendRes.status !== 202) {
    console.error('Failed to send telemetry');
    return;
  }

  // 2. Get Telemetry
  const getRes = await fetch(`${SOCIAL_URL}/telemetry/${MOCK_USER}`);
  const getData = await getRes.json();
  console.log('GET /telemetry/test-user-123:', getData);

  if (getData.latitude === 41.57 && getData.longitude === 2.26) {
    console.log('✅ Telemetry test PASSED');
  } else {
    console.error('❌ Telemetry test FAILED: Data mismatch');
  }
}

testTelemetry().catch(console.error);
