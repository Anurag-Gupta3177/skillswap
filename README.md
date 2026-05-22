# 🔄 SkillSwap — Exchange Skills, Not Money

A full-stack web platform where users exchange skills with each other instead of money. Teach what you know, learn what you want.

![SkillSwap Banner](https://via.placeholder.com/800x400/6C3BFF/white?text=SkillSwap)

## 🌐 Live Demo

- **Frontend:** https://skillswap.vercel.app
- **Backend API:** https://skillswap-backend.onrender.com

## 📸 Screenshots

> Add screenshots here after deployment

## 💡 Core Concept

> "I teach you Python, you teach me Guitar" — No money involved, pure skill trading.

## ✨ Features

- 🔐 **Authentication** — Email/Password + Google OAuth + Email Verification
- 👤 **User Profiles** — Skills offered, teaching roadmap, availability calendar
- 🎯 **Smart Matching** — Algorithm matches users with complementary skills
- 🤝 **Swap Requests** — Send, accept, decline swap requests
- 💬 **Real-time Chat** — Socket.io powered messaging between matched users
- 📅 **Session Scheduling** — Schedule teaching sessions based on shared availability
- 🔔 **Notifications** — Real-time notifications for requests and sessions
- 📊 **Progress Tracking** — Track learning progress across sessions
- 🏆 **Badges** — Gamification with achievement badges

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Socket.io Client | Real-time chat |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Socket.io | Real-time communication |
| Nodemailer | Email verification |
| Passport.js | Google OAuth |
| bcryptjs | Password hashing |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Gmail account (for email verification)
- Google Cloud Console account (for OAuth)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/skillswap.git
cd skillswap
```

### 2. Setup Backend

```bash
cd skillswap-backend
npm install
```

Create `.env` file in `skillswap-backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Start backend:
```bash
node index.js
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create `.env.local` file in `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```

### 4. Open in browser
http://localhost:3000
