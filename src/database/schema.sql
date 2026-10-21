-- Enable Foreign Keys
PRAGMA foreign_keys = ON;

-- Base User Table
CREATE TABLE IF NOT EXISTS users (
  userId INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('Adopter', 'ShelterWorker', 'Volunteer', 'Admin')),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Adopter Subclass Table
CREATE TABLE IF NOT EXISTS adopters (
  userId INTEGER PRIMARY KEY,
  adoptionPreferences TEXT,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);

-- ShelterWorker Subclass Table
CREATE TABLE IF NOT EXISTS shelter_workers (
  userId INTEGER PRIMARY KEY,
  employeeId INTEGER UNIQUE NOT NULL,
  designation TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);

-- Volunteer Subclass Table
CREATE TABLE IF NOT EXISTS volunteers (
  userId INTEGER PRIMARY KEY,
  volunteerId INTEGER UNIQUE NOT NULL,
  availability TEXT NOT NULL,
  serviceArea TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);

-- Pet Table
CREATE TABLE IF NOT EXISTS pets (
  petId INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  size TEXT NOT NULL,
  location TEXT NOT NULL,
  medicalNeeds TEXT,
  vaccinationStatus TEXT NOT NULL DEFAULT 'Vaccinated',
  adoptionStatus TEXT NOT NULL DEFAULT 'Available' CHECK(adoptionStatus IN ('Available', 'Pending', 'Adopted')),
  description TEXT,
  photoURL TEXT,
  addedBy INTEGER,
  sponsorCount INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (addedBy) REFERENCES users(userId) ON DELETE SET NULL
);

-- AdoptionApplication Table
CREATE TABLE IF NOT EXISTS adoption_applications (
  applicationId INTEGER PRIMARY KEY AUTOINCREMENT,
  petId INTEGER NOT NULL,
  adopterId INTEGER NOT NULL,
  applicationDate TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Submitted' CHECK(status IN ('Submitted', 'Under Review', 'Approved', 'Rejected')),
  applicantDetails TEXT NOT NULL,
  householdDetails TEXT NOT NULL,
  previousPetExperience TEXT,
  remarks TEXT,
  reviewedDate TEXT,
  reviewedBy INTEGER,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (petId) REFERENCES pets(petId) ON DELETE CASCADE,
  FOREIGN KEY (adopterId) REFERENCES users(userId) ON DELETE CASCADE,
  FOREIGN KEY (reviewedBy) REFERENCES users(userId) ON DELETE SET NULL
);

-- RescueAlert Table
CREATE TABLE IF NOT EXISTS rescue_alerts (
  alertId INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  photoURL TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  severity TEXT NOT NULL CHECK(severity IN ('Low', 'Medium', 'High', 'Critical')),
  status TEXT NOT NULL DEFAULT 'Reported' CHECK(status IN ('Reported', 'Assigned', 'In Progress', 'Completed', 'Closed')),
  reportedDate TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reportedBy INTEGER,
  volunteerId INTEGER,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reportedBy) REFERENCES users(userId) ON DELETE SET NULL,
  FOREIGN KEY (volunteerId) REFERENCES users(userId) ON DELETE SET NULL
);
