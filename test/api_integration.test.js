process.env.NODE_ENV = 'test';
const assert = require('assert');
const app = require('../server');

async function testApiEndpoints() {
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`📡 Testing live HTTP endpoints on ${baseUrl}...\n`);

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(healthRes.status, 200);
    const healthJson = await healthRes.json();
    assert.strictEqual(healthJson.status, 'healthy');
    console.log('✅ 1. GET /api/health passed');

    // 2. Swagger docs check
    const swaggerRes = await fetch(`${baseUrl}/api-docs.json`);
    assert.strictEqual(swaggerRes.status, 200);
    const swaggerJson = await swaggerRes.json();
    assert.strictEqual(swaggerJson.info.title, 'Pet Adoption & Animal Rescue System API');
    console.log('✅ 2. GET /api-docs.json (Swagger OpenAPI spec) passed');

    // 3. Login check (ShelterWorker Amit Gandhi)
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'amit@spit.ac.in', password: 'Password@123' })
    });
    assert.strictEqual(loginRes.status, 200);
    const loginJson = await loginRes.json();
    assert.ok(loginJson.token);
    assert.strictEqual(loginJson.user.role, 'ShelterWorker');
    console.log('✅ 3. POST /api/auth/login passed (JWT token issued)');

    const token = loginJson.token;

    // 4. List Pets
    const petsRes = await fetch(`${baseUrl}/api/pets`);
    assert.strictEqual(petsRes.status, 200);
    const petsJson = await petsRes.json();
    assert.ok(petsJson.pets.length > 0);
    console.log(`✅ 4. GET /api/pets passed (${petsJson.count} pets returned)`);

    // Create a new pet via ShelterWorker.addpet()
    const createPetRes = await fetch(`${baseUrl}/api/pets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: `Oreo_${Date.now()}`,
        species: 'Dog',
        breed: 'Border Collie',
        age: 2,
        gender: 'Male',
        size: 'Medium',
        location: 'Bhavan Shelter Main',
        adoptionStatus: 'Available'
      })
    });
    assert.strictEqual(createPetRes.status, 201);
    const createPetJson = await createPetRes.json();
    const petId = createPetJson.pet.petId;
    console.log(`✅ 4b. POST /api/pets passed (Created pet #${petId}: ${createPetJson.pet.name})`);

    // 5. Sequence Diagram 1: View Pet details -> Submit Application -> Track Application
    const viewPetRes = await fetch(`${baseUrl}/api/pets/${petId}`);
    assert.strictEqual(viewPetRes.status, 200);
    const viewPetJson = await viewPetRes.json();
    console.log(`✅ 5. Step 1-2: GET /api/pets/${petId} passed (${viewPetJson.pet.name})`);

    // Submit Application
    const submitRes = await fetch(`${baseUrl}/api/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        petId: petId,
        adopterId: 2,
        applicantDetails: 'Integration Test Adopter',
        householdDetails: 'Loving home with fenced yard',
        previousPetExperience: 'Lifelong dog parent'
      })
    });
    assert.strictEqual(submitRes.status, 201);
    const submitJson = await submitRes.json();
    const appId = submitJson.application.applicationId;
    console.log(`✅ 6. Step 3-5: POST /api/applications passed (App #${appId} submitted)`);

    // Track Application
    const trackRes = await fetch(`${baseUrl}/api/applications/${appId}/track`);
    assert.strictEqual(trackRes.status, 200);
    const trackJson = await trackRes.json();
    assert.strictEqual(trackJson.status, 'Submitted');
    console.log(`✅ 7. Step 6-7: GET /api/applications/${appId}/track passed`);

    // 6. Sequence Diagram 2: ShelterWorker Review & Approve
    const approveRes = await fetch(`${baseUrl}/api/applications/${appId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        reviewedBy: 1,
        remarks: 'Approved via integration test'
      })
    });
    assert.strictEqual(approveRes.status, 200);
    const approveJson = await approveRes.json();
    assert.strictEqual(approveJson.status, 'Approved');
    assert.strictEqual(approveJson.pet.adoptionStatus, 'Adopted');
    console.log(`✅ 8. Sequence 2: POST /api/applications/${appId}/approve passed (Pet marked Adopted)`);

    // 7. Sequence Diagram 3: Rescue Alert Flow
    const createAlertRes = await fetch(`${baseUrl}/api/rescue-alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'Injured cat near college canteen',
        latitude: 19.1240,
        longitude: 72.8360,
        severity: 'Medium'
      })
    });
    assert.strictEqual(createAlertRes.status, 201);
    const createAlertJson = await createAlertRes.json();
    const alertId = createAlertJson.alert.alertId;
    console.log(`✅ 9. Step 1-2: POST /api/rescue-alerts passed (Alert #${alertId})`);

    // Assign Volunteer
    const assignRes = await fetch(`${baseUrl}/api/rescue-alerts/${alertId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ volunteerId: 4 })
    });
    assert.strictEqual(assignRes.status, 200);
    console.log(`✅ 10. Step 3-4: POST /api/rescue-alerts/${alertId}/assign passed`);

    // Update Alert
    const updateAlertRes = await fetch(`${baseUrl}/api/rescue-alerts/${alertId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'In Progress' })
    });
    assert.strictEqual(updateAlertRes.status, 200);
    console.log(`✅ 11. Step 5-6: PUT /api/rescue-alerts/${alertId} passed`);

    // Complete Rescue
    const completeRes = await fetch(`${baseUrl}/api/rescue-alerts/${alertId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    assert.strictEqual(completeRes.status, 200);
    const completeJson = await completeRes.json();
    assert.strictEqual(completeJson.status, 'Closed');
    console.log(`✅ 12. Step 7-9: POST /api/rescue-alerts/${alertId}/complete passed (Closed automatically)`);

    console.log('\n🎉 ALL HTTP ENDPOINTS & SEQUENCE FLOWS TESTED & VERIFIED!\n');
  } finally {
    server.close();
  }
}

testApiEndpoints().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('❌ Integration test failed:', err);
  process.exit(1);
});
