const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { getDb } = require('../config/db');

function initDb() {
  const db = getDb();
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // Execute schema
  db.exec(schemaSql);
  console.log('✅ Database schema initialized successfully.');
}

function seedDb() {
  const db = getDb();
  initDb();

  // Check if users already seeded
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) {
    console.log('ℹ️ Database already contains data. Skipping initial seeding.');
    return;
  }

  console.log('🌱 Seeding database with initial records...');

  const passwordHash = bcrypt.hashSync('Password@123', 10);

  // 1. Insert Base Users
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password, phone, role)
    VALUES (?, ?, ?, ?, ?)
  `);

  // User 1: Shelter Worker (Amit Gandhi - from exp4.pdf)
  const workerRes = insertUser.run('Amit Gandhi', 'amit@spit.ac.in', passwordHash, '+91-9876543210', 'ShelterWorker');
  const workerUserId = workerRes.lastInsertRowid;
  db.prepare(`
    INSERT INTO shelter_workers (userId, employeeId, designation)
    VALUES (?, ?, ?)
  `).run(workerUserId, 101, 'Senior Animal Care Officer');

  // User 2: Adopter (Priya Sharma)
  const adopterRes = insertUser.run('Priya Sharma', 'priya@gmail.com', passwordHash, '+91-9822012345', 'Adopter');
  const adopterUserId = adopterRes.lastInsertRowid;
  db.prepare(`
    INSERT INTO adopters (userId, adoptionPreferences)
    VALUES (?, ?)
  `).run(adopterUserId, 'Medium-sized friendly dogs, vaccinated, apartment friendly');

  // User 3: Adopter (Rahul Mehta)
  const adopterRes2 = insertUser.run('Rahul Mehta', 'rahul@gmail.com', passwordHash, '+91-9811098765', 'Adopter');
  const adopterUserId2 = adopterRes2.lastInsertRowid;
  db.prepare(`
    INSERT INTO adopters (userId, adoptionPreferences)
    VALUES (?, ?)
  `).run(adopterUserId2, 'Calm and affectionate indoor cats');

  // User 4: Volunteer (Vikram Singh)
  const volunteerRes = insertUser.run('Vikram Singh', 'vikram@rescue.org', passwordHash, '+91-9988776655', 'Volunteer');
  const volunteerUserId = volunteerRes.lastInsertRowid;
  db.prepare(`
    INSERT INTO volunteers (userId, volunteerId, availability, serviceArea)
    VALUES (?, ?, ?, ?)
  `).run(volunteerUserId, 501, 'Weekdays 10 AM - 6 PM, Emergency On-Call', 'Andheri & Juhu, Mumbai');

  // User 5: Volunteer (Ananya Patel)
  const volunteerRes2 = insertUser.run('Ananya Patel', 'ananya@rescue.org', passwordHash, '+91-9977665544', 'Volunteer');
  const volunteerUserId2 = volunteerRes2.lastInsertRowid;
  db.prepare(`
    INSERT INTO volunteers (userId, volunteerId, availability, serviceArea)
    VALUES (?, ?, ?, ?)
  `).run(volunteerUserId2, 502, '24/7 Rapid Emergency Response', 'Bandra & Khar, Mumbai');

  // 2. Insert Pets
  const insertPet = db.prepare(`
    INSERT INTO pets (name, species, breed, age, gender, size, location, medicalNeeds, vaccinationStatus, adoptionStatus, description, photoURL, addedBy, sponsorCount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const pet1 = insertPet.run(
    'Buddy',
    'Dog',
    'Golden Retriever',
    2,
    'Male',
    'Large',
    'Bhavan Shelter, Andheri West',
    'None, healthy and active',
    'Fully Vaccinated',
    'Available',
    'Playful, friendly golden retriever who loves fetch and swimming.',
    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    workerUserId,
    3
  );

  const pet2 = insertPet.run(
    'Luna',
    'Cat',
    'Domestic Short Hair',
    1,
    'Female',
    'Small',
    'Bhavan Shelter, Andheri West',
    'Dewormed, slight lactose sensitivity',
    'Fully Vaccinated',
    'Available',
    'Gentle and purring kitten, loves snuggling on laps and chasing yarn.',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    workerUserId,
    1
  );

  const pet3 = insertPet.run(
    'Rocky',
    'Dog',
    'German Shepherd Mix',
    3,
    'Male',
    'Large',
    'Versova Rescue Wing',
    'Right hind leg recovering from injury (healing well)',
    'Fully Vaccinated',
    'Available',
    'Very loyal, trained in basic commands, great companion and protector.',
    'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=600&q=80',
    workerUserId,
    5
  );

  const pet4 = insertPet.run(
    'Milo',
    'Dog',
    'Beagle',
    2,
    'Male',
    'Medium',
    'Juhu Foster Center',
    'None',
    'Fully Vaccinated',
    'Pending',
    'Energetic beagle with curious nose and sweet personality.',
    'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=600&q=80',
    workerUserId,
    2
  );

  // 3. Insert Adoption Applications
  const insertApp = db.prepare(`
    INSERT INTO adoption_applications (petId, adopterId, applicationDate, status, applicantDetails, householdDetails, previousPetExperience, remarks, reviewedDate, reviewedBy)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertApp.run(
    pet4.lastInsertRowid,
    adopterUserId,
    '2026-10-15',
    'Under Review',
    'Priya Sharma, Senior Software Engineer, Work from Home',
    '3 BHK apartment with balcony, fenced society park nearby',
    'Had a Labrador for 9 years previously',
    'Home visit scheduled for upcoming Saturday',
    null,
    workerUserId
  );

  // 4. Insert Rescue Alerts
  const insertAlert = db.prepare(`
    INSERT INTO rescue_alerts (description, photoURL, latitude, longitude, severity, status, reportedDate, reportedBy, volunteerId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAlert.run(
    'Injured puppy stranded near SPIT campus entrance gate, minor front paw limping.',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
    19.1234,
    72.8361,
    'High',
    'Assigned',
    '2026-10-21 18:30:00',
    adopterUserId,
    volunteerUserId
  );

  insertAlert.run(
    'Stray kitten trapped on high balcony ledge near Versova metro station.',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&q=80',
    19.1350,
    72.8250,
    'Critical',
    'Reported',
    '2026-10-21 19:45:00',
    adopterUserId2,
    null
  );

  console.log('✅ Seed completed successfully with realistic sample records.');
}

if (require.main === module) {
  seedDb();
}

module.exports = {
  initDb,
  seedDb
};
