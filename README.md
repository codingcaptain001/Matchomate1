MatchoMate 🏠🤝

AI-Assisted Roommate Compatibility & Matching Platform

MatchoMate is a web-based platform designed to help students find compatible roommates based on their lifestyle preferences and daily habits.

Instead of assigning roommates only on room availability, MatchoMate analyzes factors such as sleep schedules, cleanliness, study habits, noise tolerance, social preferences, guest frequency, food preferences, and smoking preferences to calculate an explainable compatibility score.

The project combines a modern React frontend with a lightweight TypeScript/Express backend containing the compatibility and matching engine.

---

# 1. Problem

Traditional hostel management is often dependent on manual registers, spreadsheets, and disconnected processes.

Some of the major problems are:

- Manual hostel entry/exit registers
- Difficult room and bed management
- Room allocation based mainly on availability
- No intelligent roommate matching
- Payment tracking through separate records
- Complaints handled through informal channels
- Difficult maintenance tracking
- Separate processes for leave and visitors
- Limited visibility into hostel-wide operational data
- Hostel software is generally reactive rather than predictive

For example, when two students with very different sleep schedules, cleanliness preferences, or noise tolerance are assigned to the same room, it can lead to conflicts.
Similarly, a hostel administrator may know that complaints have increased, but may not easily understand the underlying pattern or what action should be taken.

# 2. Solution

MatchoMate provides a centralized platform for hostel operations with separate experiences for **Administrators and Students**.

### 🏢 1. Admin Operations Workspace
- **Attendance & Roll-Call**: Live biometric gate tracking, daily headcount, and bulk attendance marking.
- **Financial Ledger & Fees**: Indian fee structures, instant UPI/NEFT status tracking, receipt generator, and reminder dispatch.
- **Complaints & Maintenance**: Integrated ticketing workflow (*Registered → Assigned → Closed*) with vendor task dispatch.
- **Security & Visitor Management**: Pre-approved gate passes, OTP codes, and visitor check-in/out logs.
- **Leave & Gate Out-Passes**: Vacation and night pass reviews with parent SMS consent verification.
- **Mess & Dining Management**: 4-course daily meal scheduling, rebate ledger calculation, and kitchen quality ratings.

### 🎓 2. Resident Student Workspace
- **Student Dashboard**: Real-time room status, roommate compatibility, IN/OUT gate indicator, payment dues, and mess notices.
- **Hostel Movement Tracker**: Digital check-in (**MARK IN**) and gate out-pass generation (**MARK OUT**).
- **AI Roommate Compatibility**: Compatibility breakdown with lifestyle metrics (sleep schedule, study vibe, cleanliness).
- **Instant Fee Payments**: Seamless UPI payment simulation, receipt downloads, and transaction history.
- **Mess Rebates & Feedback**: Meal skip requests with automated ₹75/meal rebate calculation and food reviews.
- **Helpdesk & Guidelines**: 24x7 emergency hotlines, hostel FAQs, and direct confidential warden messaging.

✨ Key Features

👤 Student Profiles

Students can maintain lifestyle information used by the compatibility engine.

The current compatibility model considers:

- 💤 Sleep schedule
- 🧹 Cleanliness
- 📚 Study habits
- 🔊 Noise tolerance
- 🧑‍🤝‍🧑 Social preferences
- 👥 Guest frequency
- 🍱 Food preferences
- 🚭 Smoking preferences

---

🧠 Compatibility Engine

MatchoMate contains an explainable compatibility engine implemented in TypeScript.

Each compatibility dimension produces an individual score, which is then combined using weighted scoring.

Current weights

Compatibility Factor| Weight
Sleep Schedule| 20%
Cleanliness| 15%
Study Habits| 15%
Noise Tolerance| 15%
Social Preferences| 10%
Guest Frequency| 5%
Food Preferences| 10%
Smoking Preferences| 10%
Total| 100%

The weights are implemented directly in the backend compatibility engine.

---

📊 Compatibility Calculation

For numerical lifestyle attributes, users provide values on a 1–5 scale.

The similarity formula is:

Similarity = 100 - (|A - B| / 4 × 100)

Therefore:

Same preference → 100%
Maximum difference → 0%

For sleep schedules, the system calculates the time difference while also considering the circular nature of a 24-hour day.

Food preference is currently treated as a direct match:

Same food preference → 100%
Different food preference → 0%

The final compatibility score is the weighted combination of all eight dimensions.

---

📝 Explainable Results

MatchoMate does not only return a percentage.

The compatibility engine also generates an explanation based on the strongest and weakest compatibility dimensions.

For example:

Compatibility: 88%

Strong compatibility:
✓ Similar sleep schedules
✓ Similar study habits
✓ Similar cleanliness preferences

Areas of difference:
• Different social preferences

The backend categorizes overall compatibility into:

90+  → Excellent
75–89 → Strong
60–74 → Moderate
Below 60 → Limited

These descriptions are generated by the compatibility engine from the calculated component scores.

---

🔎 Roommate Matching

The backend provides a matching service that uses student compatibility information to generate potential roommate matches.

Matching routes currently include:

GET /api/matches/me
GET /api/matches/:studentId

The compatibility service also exposes:

POST /api/compatibility/calculate
GET /api/compatibility/:studentAId/:studentBId

These routes are registered by the Express backend.

---

## 🏗️ System Architecture

MatchoMate follows a modular **frontend + backend architecture**.

```mermaid
flowchart TB
    A[MatchoMate]

    A --> B[React + Vite Frontend]
    A --> C[Express + TypeScript Backend]

    B --> D[Student Dashboard]
    B --> E[Profile & Lifestyle Data]
    B --> F[Matching Interface]

    C --> G[REST API]

    G --> H[Student Repository]
    G --> I[Compatibility Engine]
    G --> J[Matching Service]

    H --> I
    I --> J

    I --> K[Weighted Compatibility Score]
    K --> L[Compatibility Explanation]

    J --> M[Roommate Recommendations]

---

⚙️ How the Backend Works

The backend currently uses an in-memory student repository populated from demo student data.

Student Data
     │
     ▼
Student Repository
     │
     ▼
Compatibility Service
     │
     ▼
Compatibility Engine
     │
     ├── Sleep
     ├── Cleanliness
     ├── Study
     ├── Noise
     ├── Social
     ├── Guests
     ├── Food
     └── Smoking
     │
     ▼
Overall Compatibility Score
     │
     ▼
Matching Service
     │
     ▼
Roommate Recommendations

The current repository implementation uses "InMemoryStudentRepository", so the project does not currently depend on PostgreSQL or another external database for its student matching data.

---

🚀 Getting Started

Prerequisites

Install:

- Node.js
- npm
- Git

---

1. Clone the Repository

git clone https://github.com/codingcaptain001/Matchomate1.git

cd Matchomate1

---

2. Install Dependencies

npm install

---

3. Configure Environment Variables

Create a ".env" file in the project root.

Example:

API_PORT=3001
FRONTEND_ORIGIN=http://localhost:5173
DEMO_STUDENT_ID=STU001

These are the variables currently documented by the project's ".env.example".

---

4. Start Frontend and Backend

Run:

npm run dev

The development script starts both the Vite frontend and the TypeScript/Express backend.

---

5. Run Frontend Only

npm run build

To preview the production frontend:

npm run preview

---

6. Run Backend Only

npm run server

The backend defaults to port:

3001

The server listens on "0.0.0.0" and uses the "PORT" or "API_PORT" environment variable when available.

---

🔌 API Endpoints

Health Check

GET /api/health

Returns:

{
  "status": "ok"
}

---

Students

Get all students

GET /api/students

Get a specific student

GET /api/students/:id

---

Compatibility

Calculate compatibility

POST /api/compatibility/calculate

Get compatibility between two students

GET /api/compatibility/:studentAId/:studentBId

The compatibility routes are implemented in the backend.

---

Matching

Get current/demo student's matches

GET /api/matches/me

Get matches for a student

GET /api/matches/:studentId

The matching routes are implemented through the backend matching controller and student repository.

---

🧪 Testing

The repository includes a dedicated compatibility engine test command:

npm run test:server

This executes:

server/src/services/compatibility/compatibility.engine.test.ts

You can also run linting with:

npm run lint

The available scripts are defined in "package.json".

---

🌐 Deployment

The frontend is configured for Vercel deployment.

The repository includes:

vercel.json

with a rewrite that routes requests to "index.html", supporting the Vite single-page application.

Production Frontend

Live Application:

https://matchomate1.vercel.app

---

🔐 Security & Environment Variables

Do not commit your actual ".env" file to GitHub.

Use:

.env.example

for documenting required environment variables.

Example:

API_PORT=3001
FRONTEND_ORIGIN=http://localhost:5173
DEMO_STUDENT_ID=STU001

---

🚧 Current Project Status

MatchoMate currently focuses on the student onboarding, lifestyle compatibility, and roommate matching workflow.

Implemented

- Student lifestyle data model
- Compatibility engine
- Weighted compatibility calculation
- Explainable compatibility results
- Compatibility API
- Matching API
- Student repository
- Express backend
- React/Vite frontend
- Development server setup
- Compatibility engine tests
- Vercel frontend configuration

Future Enhancements

Potential future improvements include:

- Persistent database integration
- Authentication and authorization
- Production student data
- Advanced matching filters
- Hostel/room availability integration
- Improved recommendation ranking
- Feedback-based matching
- Machine-learning-based recommendations
- Real-time notifications
- Production monitoring and analytics

---

🎯 Vision

MatchoMate aims to make roommate allocation more data-driven, transparent, and student-centric.

Instead of asking:

«"Which room is available?"»

MatchoMate focuses on:

«"Which roommate is compatible with this student's lifestyle?"»

By combining structured lifestyle data, explainable compatibility scoring, and automated matching, MatchoMate can help students make more informed roommate decisions.

---

👨‍💻 Project

MatchoMate — AI-Assisted Roommate Compatibility & Matching Platform

Built with ❤️ using React, Vite, Node.js, Express, and TypeScript.

Repository:
https://github.com/codingcaptain001/Matchomate1

Live Demo:
https://matchomate1.vercel.app