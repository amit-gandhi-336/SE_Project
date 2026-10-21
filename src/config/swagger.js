const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet Adoption & Animal Rescue System API',
      version: '1.0.0',
      description: `
### Software Engineering Project Backend (SPIT Lab Experiment 4)
This REST API implements the complete **Class Diagram** and all three **Sequence Diagrams**:
1. **Submit Adoption Application Flow** (Adopter -> Pet -> AdoptionApplication)
2. **Review Adoption Application Flow** (ShelterWorker -> AdoptionApplication -> Pet Status Update)
3. **Rescue Alert Flow** (Volunteer / Reporter -> RescueAlert -> Assignment -> Completion)

#### Actors & User Roles:
- **Adopter**: Can browse pets, submit adoption applications, and track application status.
- **ShelterWorker**: Can add new pets, review applications, and approve/reject them (updating pet status).
- **Volunteer**: Receives emergency rescue alerts, responds, updates incidents, and completes rescues.
      `,
      contact: {
        name: 'Amit Gandhi (UID: 2024300058)',
        email: 'amit@spit.ac.in'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            userId: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Amit Gandhi' },
            email: { type: 'string', example: 'amit@spit.ac.in' },
            phone: { type: 'string', example: '+91-9876543210' },
            role: { type: 'string', enum: ['Adopter', 'ShelterWorker', 'Volunteer', 'Admin'], example: 'ShelterWorker' }
          }
        },
        Pet: {
          type: 'object',
          properties: {
            petId: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Buddy' },
            species: { type: 'string', example: 'Dog' },
            breed: { type: 'string', example: 'Golden Retriever' },
            age: { type: 'integer', example: 2 },
            gender: { type: 'string', example: 'Male' },
            size: { type: 'string', example: 'Large' },
            location: { type: 'string', example: 'Bhavan Shelter, Andheri West' },
            medicalNeeds: { type: 'string', example: 'None, fully healthy' },
            vaccinationStatus: { type: 'string', example: 'Fully Vaccinated' },
            adoptionStatus: { type: 'string', enum: ['Available', 'Pending', 'Adopted'], example: 'Available' },
            description: { type: 'string', example: 'Friendly golden retriever' },
            photoURL: { type: 'string', example: 'https://images.unsplash.com/photo-1552053831-71594a27632d' },
            sponsorCount: { type: 'integer', example: 3 }
          }
        },
        AdoptionApplication: {
          type: 'object',
          properties: {
            applicationId: { type: 'integer', example: 1 },
            petId: { type: 'integer', example: 1 },
            adopterId: { type: 'integer', example: 2 },
            applicationDate: { type: 'string', format: 'date', example: '2026-10-21' },
            status: { type: 'string', enum: ['Submitted', 'Under Review', 'Approved', 'Rejected'], example: 'Submitted' },
            applicantDetails: { type: 'string', example: 'Priya Sharma, Software Engineer' },
            householdDetails: { type: 'string', example: '3 BHK apartment with balcony' },
            previousPetExperience: { type: 'string', example: 'Had a dog for 9 years' },
            remarks: { type: 'string', example: 'Application approved' },
            reviewedDate: { type: 'string', format: 'date', example: '2026-10-21' },
            reviewedBy: { type: 'integer', example: 1 }
          }
        },
        RescueAlert: {
          type: 'object',
          properties: {
            alertId: { type: 'integer', example: 1 },
            description: { type: 'string', example: 'Injured puppy near SPIT college gate' },
            photoURL: { type: 'string', example: 'https://example.com/pup.jpg' },
            latitude: { type: 'number', format: 'double', example: 19.1234 },
            longitude: { type: 'number', format: 'double', example: 72.8361 },
            severity: { type: 'string', enum: ['Low', 'Medium', 'High', 'Critical'], example: 'High' },
            status: { type: 'string', enum: ['Reported', 'Assigned', 'In Progress', 'Completed', 'Closed'], example: 'Reported' },
            reportedDate: { type: 'string', example: '2026-10-21 18:30:00' },
            reportedBy: { type: 'integer', example: 2 },
            volunteerId: { type: 'integer', example: 4 }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
