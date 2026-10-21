# Pet Adoption & Animal Rescue Management System (Backend API)

> **Software Engineering Lab — Sardar Patel Institute of Technology (SPIT)**  
> **Student:** Amit Gandhi (UID: 2024300058) | **Exp No:** 4

This is a production-grade RESTful API backend engineered in **Node.js & Express** with **SQLite**, implementing the complete Object-Oriented **Class Diagram** and all **Sequence Diagrams** from Experiment 4.

---

## 📑 Table of Contents
1. [Architecture & UML Mapping](#-architecture--uml-mapping)
2. [Sequence Diagram Implementation](#-sequence-diagram-implementation)
3. [Quick Start & Setup](#-quick-start--setup)
4. [Testing & Verification](#-testing--verification)
5. [Interactive Swagger API Documentation](#-interactive-swagger-api-documentation)
6. [API Endpoints Reference](#-api-endpoints-reference)
7. [Default Test Accounts](#-default-test-accounts)
8. [Frontend Developer Integration Guide](#-frontend-developer-integration-guide)

---

## 🏛 Architecture & UML Mapping

The backend maps 1:1 with the UML Class Diagram (`image.png`):

```
                       ┌──────────────────────┐
                       │         User         │
                       ├──────────────────────┤
                       │ +userId: int         │
                       │ +name: string        │
                       │ +email: string       │
                       │ +password: string    │
                       │ +phone: string       │
                       ├──────────────────────┤
                       │ +register()          │
                       │ +login()             │
                       │ +logout()            │
                       │ +updateprofile()     │
                       └──────────▲───────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
┌────────┴──────────┐   ┌─────────┴─────────┐    ┌─────────┴─────────┐
│      Adopter      │   │   ShelterWorker   │    │     Volunteer     │
├───────────────────┤   ├───────────────────┤    ├───────────────────┤
│+adoptionPref: str │   │ +employeeId: int  │    │ +volunteerId: int │
│                   │   │ +designation: str │    │ +availability: str│
│                   │   ├───────────────────┤    │ +serviceArea: str │
│                   │   │ +addpet()         │    └─────────┬─────────┘
└────────┬──────────┘   └─────────┬─────────┘              │ 0..1
         │ 1                      │ 1                      │
         │                        │                        │
         │ 0..*                   │ 0..*                   │ 0..*
┌────────▼────────────────────────▼─────────┐    ┌─────────▼─────────┐
│            AdoptionApplication            │    │    RescueAlert    │
├───────────────────────────────────────────┤    ├───────────────────┤
│ +applicationId: int                       │    │ +alertId: int     │
│ +applicationDate: Date                    │    │ +description: str │
│ +status: string                           │    │ +photoURL: string │
│ +applicantDetails: string                 │    │ +latitude: double │
│ +householdDetails: string                 │    │ +longitude: double│
│ +previousPetExperience: string            │    │ +severity: string │
│ +remarks: string                          │    │ +status: string   │
│ +reviewedDate: Date                       │    │ +reportedDate: Dt │
├───────────────────────────────────────────┤    ├───────────────────┤
│ +submitapplications(): void               │    │ +createRescue...()│
│ +updateApplication()                      │    │ +assignVolunteer()│
│ +trackapplication(): void                 │    │ +updateRescue...()│
│ +approveApplication()                     │    │ +completeRescue() │
│ +rejectApplication()                      │    │ +closeAlert()     │
└────────────────────┬──────────────────────┘    └───────────────────┘
                     │ 0..*
                     │
                     │ 1..*
            ┌────────▼──────────┐
            │        Pet        │
            ├───────────────────┤
            │ +petId: int       │
            │ +name: string     │
            │ +species: string  │
            │ +breed: string    │
            │ +age: int         │
            │ +gender: string   │
            │ +size: string     │
            │ +location: string │
            │ +medicalNeeds: str│
            │ +vaccinationStatus│
            │ +adoptionStatus   │
            │ +description: str │
            │ +photoURL: string │
            ├───────────────────┤
            │ +viewDetails()    │
            │ +updateStatus()   │
            │ +sponserPet()     │
            │ +updatePetDetails │
            └───────────────────┘
```

---

## 🔄 Sequence Diagram Implementation

All 3 sequence diagrams from `exp4.pdf` are implemented faithfully:

### 1. Submit Adoption Application
- **Step 1 & 2:** `GET /api/pets/:id` (`Pet.viewDetails`)
- **Step 3, 4, 5:** `POST /api/applications` (`AdoptionApplication.submitapplications` and internal `updateApplication`)
- **Step 6 & 7:** `GET /api/applications/:id/track` (`AdoptionApplication.trackapplication`)

### 2. Review Adoption Application
- **Step 1 & 2:** `GET /api/applications/:id` (`AdoptionApplication.reviewApplication`)
- **Alt [Approved]:**
  - **Step 3 & 4:** `POST /api/applications/:id/approve` (`approveApplication`)
  - **Step 5 & 6:** Pet status automatically updated to `'Adopted'` (`Pet.updateStatus`)
- **Alt [Rejected]:**
  - **Step 7 & 8:** `POST /api/applications/:id/reject` (`rejectApplication`), Pet status reverts to `'Available'`

### 3. Rescue Alert Flow
- **Step 1 & 2:** `POST /api/rescue-alerts` (`RescueAlert.createRescueAlerts`)
- **Step 3 & 4:** `POST /api/rescue-alerts/:id/assign` (`RescueAlert.assignVolunteer`)
- **Step 5 & 6:** `PUT /api/rescue-alerts/:id` (`RescueAlert.updateRescueAlerts`)
- **Step 7, 8, 9:** `POST /api/rescue-alerts/:id/complete` (`completeRescue` & internal self-call `closeAlert`)

---

## 🚀 Quick Start & Setup

### Prerequisites
- Node.js `>= 18` (Node 20+ or 24+ recommended)
- npm `>= 9`

### Installation
```bash
# Clone the repository and navigate inside
cd /home/Amit/Desktop/SE_Project

# Install dependencies
npm install

# Start development server with live reload
npm run dev

# Or start standard production server
npm start
```

Server runs on: **`http://localhost:3000`**

---

## 🧪 Testing & Verification

Run the comprehensive automated test suite (verifying both the OOP models and live HTTP REST endpoints):

```bash
npm test
```

Test output:
- `test/sequence_flows.test.js`: Verifies OOP inheritance and Sequence Diagrams 1, 2, and 3 logic.
- `test/api_integration.test.js`: Verifies end-to-end network HTTP calls, status codes, JWT auth, and payload responses.

---

## 📚 Interactive Swagger API Documentation

Open your browser to:
👉 **`http://localhost:3000/api-docs`**

Swagger UI provides:
- Live "Try it out" buttons for all endpoints
- Pre-filled JSON request body templates
- Complete schema specifications for User, Pet, Application, and RescueAlert

---

## 📡 API Endpoints Reference

### 🔐 Authentication & Users (`/api/auth`, `/api/users`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register Adopter, ShelterWorker, or Volunteer |
| `POST` | `/api/auth/login` | Login and receive JWT token |
| `POST` | `/api/auth/logout` | Invalidate session |
| `GET` | `/api/auth/profile` | Get current user profile details |
| `PUT` | `/api/auth/profile` | Update user profile (`updateprofile()`) |
| `GET` | `/api/users` | List all users |
| `GET` | `/api/users/volunteers` | List available volunteers |
| `GET` | `/api/users/shelter-workers` | List shelter workers |
| `GET` | `/api/users/adopters` | List adopters |

### 🐶 Pets (`/api/pets`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/pets` | List pets (filters: `species`, `adoptionStatus`, `search`) |
| `GET` | `/api/pets/:id` | View pet details (`viewDetails()`) |
| `POST` | `/api/pets` | Add new pet (`ShelterWorker.addpet()`) |
| `PUT` | `/api/pets/:id` | Update pet details (`updatePetDetails()`) |
| `PATCH` | `/api/pets/:id/status` | Update adoption status (`updateStatus()`) |
| `POST` | `/api/pets/:id/sponsor` | Sponsor a pet (`sponserPet()`) |

### 📝 Adoption Applications (`/api/applications`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/applications` | Submit application (`submitapplications()`) |
| `GET` | `/api/applications/:id/track` | Track application status (`trackapplication()`) |
| `GET` | `/api/applications/:id` | Review application details (`reviewApplication()`) |
| `POST` | `/api/applications/:id/approve` | Approve application & set Pet to Adopted |
| `POST` | `/api/applications/:id/reject` | Reject application & release Pet |
| `PUT` | `/api/applications/:id` | Update application info |
| `GET` | `/api/applications` | List applications (filter by adopter, pet, status) |

### 🚨 Rescue Alerts (`/api/rescue-alerts`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/rescue-alerts` | Report emergency rescue (`createRescueAlerts()`) |
| `GET` | `/api/rescue-alerts` | List alerts (filter by status, severity, volunteer) |
| `GET` | `/api/rescue-alerts/:id` | View alert details |
| `POST` | `/api/rescue-alerts/:id/assign` | Assign volunteer (`assignVolunteer()`) |
| `PUT` | `/api/rescue-alerts/:id` | Update alert details (`updateRescueAlerts()`) |
| `POST` | `/api/rescue-alerts/:id/complete` | Complete rescue & close alert (`completeRescue()`) |
| `POST` | `/api/rescue-alerts/:id/close` | Close alert directly (`closeAlert()`) |

---

## 👥 Default Test Accounts

All accounts use the default password: **`Password@123`**

| Role | Name | Email | Extra Attributes |
|---|---|---|---|
| **ShelterWorker** | Amit Gandhi | `amit@spit.ac.in` | `employeeId: 101`, `designation: Senior Animal Care Officer` |
| **Adopter** | Priya Sharma | `priya@gmail.com` | `adoptionPreferences: Medium friendly dogs` |
| **Adopter** | Rahul Mehta | `rahul@gmail.com` | `adoptionPreferences: Indoor affectionate cats` |
| **Volunteer** | Vikram Singh | `vikram@rescue.org` | `volunteerId: 501`, `serviceArea: Andheri & Juhu` |
| **Volunteer** | Ananya Patel | `ananya@rescue.org` | `volunteerId: 502`, `serviceArea: Bandra & Khar` |

---

## 🎨 Frontend Developer Integration Guide

If your teammate is building the frontend in React, Vue, Svelte, or plain HTML/JS:
1. **CORS is enabled**: Any frontend origin (e.g. `http://localhost:5173` or `http://localhost:3000`) can make fetch requests.
2. **Interactive Playground**: Send them to `http://localhost:3000/api-docs` to see every request body and copy pre-tested payloads.
3. **Authentication**:
   - Send `Authorization: Bearer <token>` in headers for protected routes.
   - For easy development, IDs (`adopterId`, `reviewedBy`, etc.) can also be passed directly in the JSON request body!
