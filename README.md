# 🏨 AI Hotel Management System (MVP)

A full-stack MERN Hotel Management System with AI-powered Smart Booking Assistant.

## 📌 Features

### ✅ Authentication System
- JWT-based login/logout
- Role-based access (Admin & Staff)
- Password hashing with bcrypt
- Protected routes

### ✅ Dashboard
- Total Rooms, Available Rooms, Booked Rooms
- Total Bookings & Revenue
- Charts (Room Types Bar Chart, Status Pie Chart)
- Recent Bookings Table

### ✅ Room Management
- Add, Edit, Delete Rooms
- Room Types: Single, Double, Deluxe
- Status Tracking: Available, Booked, Cleaning

### ✅ Booking System
- Create Bookings with Guest Info
- Auto Room Status Updates
- Checkout & Cancel functionality
- Total Amount Calculation

### 🤖 AI Smart Booking Assistant
- Natural language input (e.g., "cheap room for 2 people")
- Keyword-based room suggestion engine
- **Advanced Logic:** Guest count awareness and price range intelligence
- Supports English & Roman Urdu keywords

### ⚡ Enterprise Features (NEW)
- **Real-time Notifications:** Instant updates for bookings and housekeeping via Socket.io.
- **Dynamic Pricing:** Automatic price adjustments based on weekends and occupancy levels.
- **PDF Invoice Export:** Professional invoice generation and download using jsPDF.
- **Security Hardening:** Rate limiting, Helmet security headers, and NoSQL injection prevention.
- **Performance Optimized:** Code splitting (Lazy Loading) and Database indexing for lightning-fast queries.

---

## 🛠️ Tech Stack

| Layer      | Technology           |
|------------|---------------------|
| Frontend   | React.js (Vite)     |
| Backend    | Node.js + Express   |
| Database   | MongoDB (Mongoose)  |
| Auth       | JWT + bcrypt        |
| Charts     | Recharts            |
| HTTP       | Axios               |
| Icons      | React Icons         |

---

## 📁 Folder Structure

```
hotel-management/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── context/         # State management
│   │   │   └── AuthContext.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Rooms.jsx
│   │   │   ├── Bookings.jsx
│   │   │   ├── AIAssistant.jsx
│   │   │   └── CreateUser.jsx
│   │   ├── services/        # API config
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── server/                  # Express Backend
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── roomController.js
│   │   ├── bookingController.js
│   │   ├── dashboardController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validate.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Room.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── roomRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── aiRoutes.js
│   ├── server.js
│   ├── seed.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 🚀 Setup Guide

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone the Project
```bash
git clone <repo-url>
cd hotel-management
```

### Step 2: Setup Backend
```bash
cd server
npm install
```

### Step 3: Configure Environment
Edit `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel_management
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

### Step 4: Seed Database
```bash
npm run seed
```
This creates:
- **Admin:** admin@hotel.com / admin123
- **Staff:** staff@hotel.com / staff123
- **10 Sample Rooms** (Single, Double, Deluxe)

### Step 5: Start Backend Server
```bash
npm run dev
```
Server runs on: http://localhost:5000

### Step 6: Setup Frontend
```bash
cd ../client
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

---

## 🧠 How the System Works

### Authentication Flow
1. User enters email/password on Login page
2. Server verifies credentials, returns JWT token
3. Token stored in localStorage, sent with every API request
4. Protected routes check token validity via middleware

### Booking Flow
1. Staff/Admin creates booking → selects available room
2. Room status auto-changes: Available → Booked
3. On Checkout → Room status: Booked → Cleaning
4. On Cancel → Room status: Booked → Available

### AI Assistant Logic (Rule-Based)
1. User types natural language query
2. System extracts keywords from input
3. Keywords mapped to room types & price ranges:
   - "cheap/sasta/budget" → Single rooms, low price
   - "luxury/deluxe/premium" → Deluxe rooms, high price
   - "family/group" → Double/Deluxe rooms
4. Matching available rooms fetched from database
5. Results displayed with suggestions

---

## 🔐 Security

- JWT tokens with 7-day expiration
- bcrypt password hashing (10 salt rounds)
- Role-based access control (Admin vs Staff)
- Input validation with express-validator
- CORS configured for frontend origin

---

## 🎨 Color Palette

| Color          | Hex Code |
|----------------|----------|
| Primary        | #0A2A43  |
| Secondary      | #081F5C  |
| Accent         | #00C2A8  |
| Background     | #F5F7FA  |
| Card           | #FFFFFF  |
| Text Primary   | #1A1A1A  |
| Text Secondary | #6B7280  |
| Error          | #EF4444  |
| Success        | #10B981  |

---

## 📧 Demo Credentials

| Role  | Email            | Password |
|-------|-----------------|----------|
| Admin | admin@hotel.com | admin123 |
| Staff | staff@hotel.com | staff123 |

---

## 👨‍💻 Developed By

5th Semester E-Project — AI Hotel Management System
