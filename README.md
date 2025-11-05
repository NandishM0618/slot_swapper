
# Event Swap Application

A full-stack calendar and event swapping application where users can create events, mark them as swappable, and request swaps with other users. Events and swap requests update dynamically within the user session.

---

## Features

* User authentication (JWT-based)
* Create, update, and delete events
* Mark events as **SWAPPABLE** to allow swaps
* Send swap requests to other users
* Accept or reject swap requests
* Frontend updates dynamically within the same session
* Responsive design for sidebar and calendar

---

## Tech Stack

* **Frontend:** React.js, Redux Toolkit, Tailwind CSS, date-fns
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT (JSON Web Token)

---

## Installation

### Prerequisites

* Node.js >= 18
* npm or yarn
* MongoDB running locally or MongoDB Atlas URI

---

## Setup Instructions

### **1. Clone Repository**

```bash
git clone https://github.com/NandishM0618/slot_swapper.git
cd slot_swapper
```

---

### **2. Setup Server (Backend)**

```bash
npm install
```

#### Create `.env` File

```
PORT=8080
MONGO_URI=mongodb://localhost:27017/slot-swaper
```

#### Run Backend

```bash
npm run dev
```

Server runs at:
[http://localhost:8080](http://localhost:8080)

---

### **3. Setup Frontend (Client)**

```bash
cd src/frontend
npm install
```

#### Create `.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

#### Run Frontend

```bash
npm run dev
```

App runs at:
 [http://localhost:3000](http://localhost:3000)


---

## Folder Structure

```
backend/
  ├─ controllers/
  │   ├─ authController.js
  │   └─ eventController.js
  ├─ models/
  │   ├─ User.js
  │   ├─ Event.js
  │   └─ SwapRequest.js
  ├─ routes/
  │   ├─ authRoutes.js
  │   └─ eventRoutes.js
  ├─ middleware/
  │   └─ authMiddleware.js
  ├─ server.js
frontend/
  ├─ components/
  │   ├─ Sidebar.js
  │   └─ CalendarView.js
  ├─ store/
  │   └─ reducers/
  │       └─ eventSlice.js
  ├─ pages/
  │   └─ index.js
  └─ App.js
```

---

## API Endpoints

| Method | Route                | Description                     |
| ------ | -------------------- | ------------------------------- |
| POST   | `/users/register`     | Register a new user             |
| POST   | `/users/login`        | Login user                      |
| GET    | `/events/me`         | Get current user's events       |
| POST   | `/events`            | Create a new event              |
| PATCH  | `/events/:id/status` | Update event status             |
| DELETE | `/events/:id`        | Delete an event                 |
| GET    | `/swap-requests`     | Get pending swap requests       |
| POST   | `/swap-request`      | Create a new swap request       |
| POST   | `/swap-response/:id` | Accept or reject a swap request |

---

## Redux State

```js
{
  myEvents: [],       // User's events
  swapRequests: [],   // Pending swap requests
  swappableSlots: [], // All swappable slots
  status: 'idle',     // loading status
  error: null         // error messages
}
```

---

## Usage

* Click a date on the calendar to create an event.
* Mark your event as **SWAPPABLE** to allow other users to request a swap.
* Accept or reject incoming swap requests in the sidebar.
* Your events and swap requests update dynamically in the current session.

---

## Screenshots

- <img width="1919" height="946" alt="Screenshot 2025-11-05 152723" src="https://github.com/user-attachments/assets/c0ca796f-4ed6-4cd1-b110-2224b4f9e387" />

- <img width="1917" height="947" alt="Screenshot 2025-11-05 152858" src="https://github.com/user-attachments/assets/8dbfd306-60a0-4783-9384-6810b0b10692" />

- <img width="1920" height="945" alt="Screenshot 2025-11-05 152914" src="https://github.com/user-attachments/assets/7955ae8c-8dd1-40d8-9479-65c0ab3b3d84" />

--- 

## Notes

* Currently, swap requests update dynamically **only in the same browser session**.
* To see updates on another user's browser, a page refresh is required.
* For real-time updates across multiple users, consider integrating **WebSockets (Socket.IO)**.

---

## Live link
- https://slot-swapper-beryl.vercel.app


