# 💬 Chat Application - MERN Stack

A full-stack real-time chat application built with MongoDB, Express.js, React.js, and Node.js featuring real-time messaging, group chats, and user authentication.

## ✨ Features

- User authentication with JWT
- One-on-one and group messaging
- Real-time messaging with typing indicators
- User search and profile management
- Create/update/delete group chats
- Image upload with Cloudinary
- Real-time notifications

## 🛠️ Tech Stack

**Frontend:** React, Chakra UI, Socket.io Client, Axios  
**Backend:** Node.js, Express, MongoDB, Socket.io, JWT, bcryptjs  
**Other:** Cloudinary (image hosting), dotenv

## � Installation

### Prerequisites

- Node.js (v12+)
- MongoDB Atlas account
- Cloudinary account

### Setup

1. **Clone & install**

   ```bash
   git clone <repo-url>
   cd ChatApp
   npm install
   cd frontend && npm install
   ```

2. **Environment variables**

   Backend `.env`:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/chatapp
   JWT_SECRET=your_secret_key_here
   CORS_ORIGIN=http://localhost:3000
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   Frontend `.env.local`:

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   REACT_APP_CLOUDINARY_NAME=your_cloud_name
   REACT_APP_CLOUDINARY_PRESET=your_preset
   ```

## � Running

**Terminal 1 - Backend:**

```bash
npm run server
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

Backend runs on `http://localhost:5000`, Frontend on `http://localhost:3000`

## �📡 API Endpoints

| Route   | Endpoint                                        | Method       |
| ------- | ----------------------------------------------- | ------------ |
| User    | `/api/user/login`                               | POST         |
|         | `/api/user`                                     | POST/GET/PUT |
| Chat    | `/api/chat`                                     | GET/POST     |
|         | `/api/chat/group`                               | POST         |
|         | `/api/chat/rename`, `/groupadd`, `/groupremove` | PUT          |
| Message | `/api/message`                                  | POST/GET     |

## 🔐 Security

- JWT-based authentication
- Password hashing with bcryptjs
- Environment variables (no hardcoded secrets)
- Protected API routes
- CORS enabled

## 📝 Available Scripts

```bash
npm run server    # Start backend with nodemon
npm run build     # Build for production
npm start         # Run production build
```

## 📄 License

ISC License
