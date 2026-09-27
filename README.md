# MatchoMate 🏠🤖

## AI-Powered Student Housing Intelligence Platform

MatchoMate is an AI-powered hostel management platform designed to simplify hostel operations while using student and operational data to provide intelligent insights and better decision-making.

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


## AI-Powered Features

### AI Roommate Compatibility

The system analyzes student lifestyle preferences such as:

- Sleep schedule
- Cleanliness
- Noise tolerance
- Study routine
- Social preferences

and generates an explainable compatibility score.

Example:

```text
Compatibility: 91%

Sleep Schedule       94%
Cleanliness          88%
Study Routine        93%
Noise Preference     90%
Social Lifestyle     86%

## 🛠️ Technology Stack
- **Frontend**: React 18, React Router v6, Vite
- **Styling**: Vanilla CSS Design Tokens, Glassmorphism, Micro-animations
- **Icons**: Lucide React
- **Charts**: Recharts

---

# 📈 Impact & Benefits

MatchoMate aims to transform hostel management from a manual and reactive process into a centralized, data-driven, and AI-assisted system.

## 👨‍💼 Impact on Hostel Administrators

### 1. Centralized Operations

Instead of managing separate registers, spreadsheets, and communication channels, administrators can manage major hostel operations from one platform.

This includes:

- Students
- Rooms and beds
- Payments
- Complaints
- Maintenance
- Hostel movement
- Visitors
- Leave requests
- Mess

### 2. Reduced Manual Work

Digital workflows reduce repetitive tasks such as:

- Maintaining physical movement registers
- Checking payment records manually
- Tracking complaint status
- Managing room occupancy
- Maintaining separate student records

### 3. Better Decision Making

Instead of looking only at raw data, administrators can receive meaningful insights from:

- Occupancy data
- Payment data
- Complaint patterns
- Maintenance records
- Student feedback
- Roommate compatibility

This helps administrators make more informed decisions.

### 4. Proactive Hostel Management

AI-powered insights can help identify potential issues before they become major problems.

For example:

```text
Repeated complaints
        ↓
Pattern detected
        ↓
Admin alerted
        ↓
Preventive action


# 🔧 Technical Details

## 1. System Architecture

MatchoMate follows a modular client-server architecture.

```text
                    MATCHOMATE
                        │
                        ▼
              ┌─────────────────┐
              │ Next.js Frontend│
              │ React + 
              └────────┬────────┘
                       │ REST API
                       ▼
              ┌─────────────────┐
              │ FastAPI Backend │
              │ Python          │
              └────────┬────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
    PostgreSQL      AI/ML       Analytics
     Database      Services      Services
          │            │            │
          └────────────┼────────────┘
                       ▼
                Processed Data
                       │
                       ▼
                 Frontend UI
