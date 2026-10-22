/**
 * Automated Verification Test for Pet Adoption & Rescue Backend
 * Tests all 3 Sequence Diagrams and Class Diagram models
 */
process.env.NODE_ENV = 'test';
const assert = require('assert');
const { getDb } = require('../src/config/db');

const { seedDb } = require('../src/database/seed');
const User = require('../src/models/User');
const Adopter = require('../src/models/Adopter');
const ShelterWorker = require('../src/models/ShelterWorker');
const Volunteer = require('../src/models/Volunteer');
const Pet = require('../src/models/Pet');
const AdoptionApplication = require('../src/models/AdoptionApplication');
const RescueAlert = require('../src/models/RescueAlert');

async function runTests() {
  console.log('🧪 Starting automated verification tests for UML models & Sequence flows...\n');
  seedDb();

  // ---------------------------------------------------------
  // TEST 1: User Inheritance & Class Diagram Methods
  // ---------------------------------------------------------
  console.log('▶ Test 1: Class Diagram Model Verification (User, Adopter, ShelterWorker, Volunteer, Pet)...');
  
  // Register Adopter
  const testAdopter = Adopter.register({
    name: 'Test Adopter 1',
    email: `adopter_${Date.now()}@example.com`,
    password: 'Password@123',
    phone: '+91-9000000001',
    adoptionPreferences: 'Small friendly dogs'
  });
  assert.ok(testAdopter.userId, 'Adopter should have userId');
  assert.strictEqual(testAdopter.role, 'Adopter', 'Role should be Adopter');
  assert.strictEqual(testAdopter.adoptionPreferences, 'Small friendly dogs');

  // Register ShelterWorker
  const testWorker = ShelterWorker.register({
    name: 'Amit Gandhi',
    email: `worker_${Date.now()}@spit.ac.in`,
    password: 'Password@123',
    phone: '+91-9000000002',
    employeeId: Math.floor(1000 + Math.random() * 9000),
    designation: 'Lead Animal Care Officer'
  });
  assert.ok(testWorker.userId, 'ShelterWorker should have userId');
  assert.strictEqual(testWorker.role, 'ShelterWorker');

  // ShelterWorker.addpet() method
  const newPet = ShelterWorker.addpet(testWorker.userId, {
    name: 'Charlie',
    species: 'Dog',
    breed: 'Beagle',
    age: 2,
    gender: 'Male',
    size: 'Medium',
    location: 'Bhavan Shelter A',
    medicalNeeds: 'None',
    vaccinationStatus: 'Fully Vaccinated',
    adoptionStatus: 'Available',
    description: 'Energetic and friendly beagle pup.',
    photoURL: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2'
  });
  assert.ok(newPet.petId, 'Pet should have petId');
  assert.strictEqual(newPet.name, 'Charlie');
  assert.strictEqual(newPet.adoptionStatus, 'Available');

  // Pet.sponserPet()
  const sponsorRes = Pet.sponserPet(newPet.petId, { amount: 500 });
  assert.strictEqual(sponsorRes.sponsorCount, 1, 'Sponsor count should increment');

  // Pet.updatePetDetails()
  const updatedPet = Pet.updatePetDetails(newPet.petId, { age: 3 });
  assert.strictEqual(updatedPet.age, 3, 'Age should be updated to 3');

  console.log('  ✅ Class Diagram models & methods verified successfully.\n');

  // ---------------------------------------------------------
  // TEST 2: Sequence Diagram 1 - Submit Adoption Application
  // Steps:
  // 1: viewDetails -> Pet
  // 2: petDetails(name, breed, etc.)
  // 3: submitApplication -> AdoptionApplication
  // 4: updateApplication (internal self-call)
  // 5: Application submitted
  // 6: trackApplication -> AdoptionApplication
  // 7: Display application status
  // ---------------------------------------------------------
  console.log('▶ Test 2: Sequence Diagram 1 (Submit Adoption Application Flow)...');

  // Step 1 & 2: Adopter views pet details
  const petDetails = Pet.viewDetails(newPet.petId);
  assert.ok(petDetails, 'Pet details retrieved');
  assert.strictEqual(petDetails.name, 'Charlie');
  console.log(`  [Step 1 & 2] Adopter viewed details for pet: ${petDetails.name} (${petDetails.breed})`);

  // Step 3, 4, 5: Adopter submits application
  const appSubmitted = AdoptionApplication.submitapplications({
    petId: newPet.petId,
    adopterId: testAdopter.userId,
    applicantDetails: 'Full-time engineer living with family',
    householdDetails: 'Apartment with garden access',
    previousPetExperience: '5 years with beagle',
    remarks: 'Ready for home check'
  });
  assert.ok(appSubmitted.applicationId, 'Application should have applicationId');
  assert.strictEqual(appSubmitted.status, 'Submitted', 'Initial status should be Submitted');
  console.log(`  [Step 3, 4, 5] Application submitted: #${appSubmitted.applicationId}, Status: ${appSubmitted.status}`);

  // Step 6 & 7: Adopter tracks application
  const trackedApp = AdoptionApplication.trackapplication(appSubmitted.applicationId);
  assert.strictEqual(trackedApp.applicationId, appSubmitted.applicationId);
  assert.strictEqual(trackedApp.status, 'Submitted');
  console.log(`  [Step 6 & 7] Application tracked successfully: Status is "${trackedApp.status}"`);

  console.log('  ✅ Sequence Diagram 1 verified successfully.\n');

  // ---------------------------------------------------------
  // TEST 3: Sequence Diagram 2 - Review Adoption Application
  // Steps:
  // 1: reviewApplication
  // 2: application details
  // alt [if Application approved]:
  // 3: approveApplication
  // 4: Status = Approved
  // 5: updateStatus -> Pet
  // 6: Pet Status Updated (to Adopted)
  // ---------------------------------------------------------
  console.log('▶ Test 3: Sequence Diagram 2 (Review & Approve Adoption Application Flow)...');

  // Step 1 & 2: Shelter worker reviews application
  const reviewRes = AdoptionApplication.reviewApplication(appSubmitted.applicationId);
  assert.strictEqual(reviewRes.status, 'Under Review', 'Status transitions to Under Review');
  console.log(`  [Step 1 & 2] Shelter worker reviewed application #${reviewRes.applicationId}: Details retrieved`);

  // Step 3, 4, 5, 6: Approve application
  const approveRes = AdoptionApplication.approveApplication(
    appSubmitted.applicationId,
    testWorker.userId,
    'Home check verified. Approved!'
  );
  assert.strictEqual(approveRes.status, 'Approved', 'Application status should be Approved');
  assert.strictEqual(approveRes.pet.adoptionStatus, 'Adopted', 'Pet adoption status must be updated to Adopted');

  // Verify pet in database is now Adopted
  const verifiedPet = Pet.viewDetails(newPet.petId);
  assert.strictEqual(verifiedPet.adoptionStatus, 'Adopted', 'Pet in DB is Adopted');
  console.log(`  [Step 3, 4, 5, 6] Application approved! Pet #${verifiedPet.petId} (${verifiedPet.name}) adoption status updated to "${verifiedPet.adoptionStatus}"`);

  // Test Alternative Flow: Reject Application
  console.log('  Testing Alternative Flow: Reject Application...');
  const petForReject = ShelterWorker.addpet(testWorker.userId, {
    name: 'Whiskers',
    species: 'Cat',
    breed: 'Persian',
    age: 1,
    gender: 'Female',
    size: 'Small',
    location: 'Bhavan Shelter B'
  });
  const rejectApp = AdoptionApplication.submitapplications({
    petId: petForReject.petId,
    adopterId: testAdopter.userId,
    applicantDetails: 'Applicant 2'
  });
  const rejectRes = AdoptionApplication.rejectApplication(
    rejectApp.applicationId,
    testWorker.userId,
    'Shelter not able to accommodate request at this time.'
  );
  assert.strictEqual(rejectRes.status, 'Rejected');
  const petAfterReject = Pet.viewDetails(petForReject.petId);
  assert.strictEqual(petAfterReject.adoptionStatus, 'Available', 'Pet returns to Available status');
  console.log(`  [Alt Step 7 & 8] Application rejected. Pet returns to "${petAfterReject.adoptionStatus}".`);

  console.log('  ✅ Sequence Diagram 2 verified successfully.\n');

  // ---------------------------------------------------------
  // TEST 4: Sequence Diagram 3 - Rescue Alert
  // Steps:
  // 1: createRescueAlerts
  // 2: Alert created
  // 3: assignVolunteer
  // 4: Volunteer assigned
  // 5: updateRescueAlerts
  // 6: Alert updated
  // 7: completeRescue
  // 8: closeAlert (internal self call)
  // 9: Rescue Completed
  // ---------------------------------------------------------
  console.log('▶ Test 4: Sequence Diagram 3 (Rescue Alert Flow)...');

  // Register Volunteer
  const testVolunteer = Volunteer.register({
    name: 'Volunteer Vikram',
    email: `vol_${Date.now()}@example.com`,
    password: 'Password@123',
    phone: '+91-9000000003',
    volunteerId: Math.floor(5000 + Math.random() * 4000),
    availability: '24/7',
    serviceArea: 'Andheri West'
  });

  // Step 1 & 2: createRescueAlerts
  const alertRes = RescueAlert.createRescueAlerts({
    description: 'Injured street dog found near SPIT library block',
    photoURL: 'https://example.com/rescue.jpg',
    latitude: 19.1235,
    longitude: 72.8365,
    severity: 'High',
    reportedBy: testAdopter.userId
  });
  assert.ok(alertRes.alert.alertId, 'Alert created with ID');
  assert.strictEqual(alertRes.alert.status, 'Reported');
  console.log(`  [Step 1 & 2] Alert created: #${alertRes.alert.alertId}, Status: ${alertRes.alert.status}`);

  // Step 3 & 4: assignVolunteer
  const assignRes = RescueAlert.assignVolunteer(alertRes.alert.alertId, testVolunteer.userId);
  assert.strictEqual(assignRes.alert.status, 'Assigned');
  assert.strictEqual(assignRes.alert.volunteerId, testVolunteer.userId);
  console.log(`  [Step 3 & 4] Volunteer assigned: ${assignRes.alert.volunteerName}, Status: ${assignRes.alert.status}`);

  // Step 5 & 6: updateRescueAlerts
  const updateRes = RescueAlert.updateRescueAlerts(alertRes.alert.alertId, {
    status: 'In Progress',
    description: 'Volunteer arrived on site with first-aid kit.'
  });
  assert.strictEqual(updateRes.alert.status, 'In Progress');
  console.log(`  [Step 5 & 6] Alert updated: Status is "${updateRes.alert.status}"`);

  // Step 7, 8, 9: completeRescue & closeAlert
  const completeRes = RescueAlert.completeRescue(alertRes.alert.alertId);
  assert.strictEqual(completeRes.alert.status, 'Closed');
  console.log(`  [Step 7, 8, 9] completeRescue() executed. Self-call closeAlert() closed alert #${completeRes.alert.alertId}. Status: ${completeRes.alert.status}`);

  console.log('  ✅ Sequence Diagram 3 verified successfully.\n');

  console.log('🎉 ALL TESTS PASSED! Backend models and sequence diagram flows are 100% verified!\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
