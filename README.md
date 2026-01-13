# 🚀 **PenThread - Full-Stack Blog Platform**

![Node.js](https://img.shields.io/badge/Node.js-18.x-339)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge\&logohttps://img.shields.io/badge/Express-4.x-https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge\&logoio/badge/JWT-Secured-000000?style=for-)

## 🌟 **Project Vision**

**PenThread** is a modern, full-stack blogging platform designed for **content creators, readers, and moderators** to collaborate seamlessly. Built with enterprise-grade architecture, it delivers:

🌟 **Rich content creation** with categories and tags
📊 **Role-based dashboards** (User, Author, Admin)
💬 **Advanced comment system** with moderation
❤️ **Social interactions** (likes, favorites, views)
🔔 **Real-time notifications**
🎨 **Beautiful, responsive UI** with dark mode

---

## 💇️ **Architecture Overview**

```
┌─────────────────────────────────────────────────────────┐
│                    PENTHREAD PLATFORM                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐        ┌───────────────────┐     │
│  │   REACT FRONTEND │◄──────►│  EXPRESS BACKEND  │     │
│  │                  │  REST  │                   │     │
│  │  • Vite + React  │  API   │  • Node.js        │     │
│  │  • Tailwind CSS  │        │  • JWT Auth       │     │
│  │  • Zustand       │        │  • Mongoose ODM   │     │
│  │  • Axios         │        │  • Joi Validation │     │
│  └──────────────────┘        └───────────────────┘     │
│         ▲                              ▲                │
│         │                              │                │
│         │                              ▼                │
│         │                    ┌───────────────────┐     │
│         │                    │  MONGODB DATABASE │     │
│         │                    │                   │     │
│         │                    │  • Users          │     │
│         │                    │  • Posts          │     │
│         │                    │  • Comments       │     │
│         └────────────────────│  • Interactions   │     │
│           JWT + localStorage │  • Notifications  │     │
│                              └───────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 **Key Features**

### **🔐 Authentication & Authorization**

* JWT-based secure authentication
* Role-based access control (User, Author, Admin)
* Password reset with email verification
* Token refresh mechanism

### **📝 Content Management**

* Rich blog post creation and editing
* Category and tag organization
* Draft/Publish workflow
* Author-owned content management

### **💬 Advanced Comment System**

* Nested comment threads
* Author/Admin comment moderation (Approve/Reject)
* Comment status tracking (Pending/Approved/Rejected)
* Comment owner deletion rights

### **❤️ Social Interactions**

* Like posts
* Favorite/bookmark posts
* View count tracking
* User interaction history

### **📊 Analytics Dashboards**

* **User Dashboard**: Personal activity and stats
* **Author Dashboard**: Post performance metrics
* **Admin Dashboard**: Platform-wide analytics

### **🔔 Notifications**

* Comment notifications
* Moderation updates
* Interaction alerts
* Mark as read/unread

### **🎨 Modern UI/UX**

* Responsive design (mobile-first)
* Dark mode support
* Smooth animations (Framer Motion)
* Accessibility compliant

---

## 🔧 **Technology Stack**

### **Frontend**

| Technology     | Purpose                 |
| -------------- | ----------------------- |
| React 18       | UI component library    |
| Vite 5         | Build tool & dev server |
| Tailwind CSS 3 | Utility-first styling   |
| Zustand        | State management        |
| React Router 6 | Client-side routing     |
| Axios          | HTTP client             |
| Framer Motion  | Animations              |
| Lucide React   | Icon library            |

### **Backend**

| Technology  | Purpose               |
| ----------- | --------------------- |
| Node.js 18+ | Runtime environment   |
| Express 4   | Web framework         |
| MongoDB 6   | NoSQL database        |
| Mongoose    | ODM for MongoDB       |
| JWT         | Authentication tokens |
| Joi         | Request validation    |
| Bcryptjs    | Password hashing      |
| Winston     | Logging               |
| Nodemailer  | Email notifications   |

---

## 🗂️ **Project Structure**

```bash
📦 penthread/
│
├── 📁 backend/              # Node.js + Express API
│   ├── src/
│   │   ├── config/          # DB, logger, env configs
│   │   ├── modules/         # Feature modules (auth, posts, etc.)
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   ├── utils/           # Helpers, constants
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── 📁 frontend/             # React + Vite SPA
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   ├── store/           # Zustand stores
│   │   ├── context/         # React contexts
│   │   ├── utils/           # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── README.md
│
└── 📘 README.md             # This file
```

---

## 🚀 **Getting Started**

### **Prerequisites**

* Node.js 18+ and npm 9+
* MongoDB 6+ (local or Atlas)
* Git

### **Installation**

#### **1. Clone Repository**

```bash
git clone https://github.com/yourusername/penthread.git
cd penthread
```

#### **2. Backend Setup**

```bash
cd backend
npm install
cp .env.sample .env
# Edit .env with your MongoDB URI, JWT secret, etc.
npm run db:seed  # Seed database with sample data
npm run dev      # Start backend on port 4000
```

#### **3. Frontend Setup**

```bash
cd ../frontend
npm install
cp .env.sample .env
# Set VITE_API_BASE_URL=http://localhost:4000/api
npm run dev      # Start frontend on port 5173
```

#### **4. Access Application**

* Frontend: `http://localhost:5173`
* Backend API: `http://localhost:4000/api`

### **Default Seeded Accounts**

| Role   | Email                                           | Password   |
| ------ | ----------------------------------------------- | ---------- |
| Admin  | [admin@example.com](mailto:admin@example.com)   | Admin@123  |
| Author | [author@example.com](mailto:author@example.com) | Author@123 |
| User   | [user@example.com](mailto:user@example.com)     | User@123   |

---

## 🧹 **API Documentation**

### **Base URL**

```
http://localhost:4000/api
```

### **Module Endpoints**

| Module        | Endpoints                                        | Auth Required |
| ------------- | ------------------------------------------------ | ------------- |
| Auth          | `/auth/register`, `/auth/login`, `/auth/refresh` | Mixed         |
| Users         | `/users`, `/users/:id`, `/users/profile`         | ✅             |
| Posts         | `/posts`, `/posts/:id`, `/posts/:id/publish`     | ✅             |
| Comments      | `/posts/:postId/comments`, `/comments/pending`   | ✅             |
| Categories    | `/categories`, `/categories/:id`                 | Mixed         |
| Tags          | `/tags`, `/tags/:id`                             | Mixed         |
| Interactions  | `/interactions/like`, `/interactions/favorite`   | ✅             |
| Notifications | `/notifications`, `/notifications/:id/read`      | ✅             |
| Dashboard     | `/dashboard/admin`, `/dashboard/author`          | ✅             |

**Import Postman Collection**: `backend/postman_collection.json`

---

## 👥 **User Roles & Permissions**

| Feature                    | User | Author | Admin |
| -------------------------- | :--: | :----: | :---: |
| View published posts       |   ✅  |    ✅   |   ✅   |
| Create posts               |   ❌  |    ✅   |   ✅   |
| Edit own posts             |   ❌  |    ✅   |   ✅   |
| Edit any post              |   ❌  |    ❌   |   ✅   |
| Comment on posts           |   ✅  |    ✅   |   ✅   |
| Moderate own post comments |   ❌  |    ✅   |   ✅   |
| Moderate all comments      |   ❌  |    ❌   |   ✅   |
| Manage categories/tags     |   ❌  |    ✅   |   ✅   |
| View analytics             |  Own |   Own  |  All  |
| User management            |   ❌  |    ❌   |   ✅   |

---

## 🔒 **Security Features**

✅ **Authentication**

* JWT access & refresh tokens
* Bcrypt password hashing (10 rounds)
* HTTP-only cookies (optional)

✅ **Authorization**

* Role-based middleware protection
* Resource ownership validation
* API endpoint guarding

✅ **Data Protection**

* Request validation with Joi schemas
* MongoDB injection prevention
* XSS protection via React JSX
* CORS configuration
* Rate limiting (Helmet + express-rate-limit)

✅ **Best Practices**

* Environment variable isolation
* Centralized error handling
* Audit logging with Winston
* Secure HTTP headers

---

## 📊 **Database Schema**

### **Core Collections**

* **users** - User accounts with role and profile info
* **posts** - Blog posts with status, categories, tags
* **comments** - Comments with moderation status
* **categories** - Post categorization
* **tags** - Post tagging
* **interactions** - Likes, favorites, views
* **notifications** - User notifications
* **activityLogs** - Audit trail

### **Relationships**

* Users ↔ Posts (1:N - author relationship)
* Posts ↔ Comments (1:N)
* Posts ↔ Categories (N:M)
* Posts ↔ Tags (N:M)
* Users ↔ Interactions (1:N)

---

## 🥯 **Testing**

### **Backend Testing**

```bash
cd backend
npm run test        # Run Jest tests (to be implemented)
```

**Postman Collection**:

* Automated tests for all endpoints
* Environment variables for token management
* Complete workflow testing

### **Frontend Testing**

```bash
cd frontend
npm run test        # Run Vitest (to be implemented)
npm run test:e2e    # Run Playwright E2E tests
```

---

## 📦 **Deployment**

### **Backend Deployment (Railway/Heroku/AWS)**

```bash
# Build command
npm install
# Start command
npm run start
# Environment variables
NODE_ENV=production
MONGO_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<your-secret>
```

### **Frontend Deployment (Vercel/Netlify)**

```bash
# Build command
npm run build
# Output directory
dist/
# Environment variables
VITE_API_BASE_URL=http://localhost:4000/api
```

---

## 🌈 **Features Roadmap**

### **Phase 1 (Completed)** ✅

* Full authentication system
* Post CRUD with workflow
* Comment system with moderation
* Dashboard analytics
* Social interactions

### **Phase 2 (Upcoming)** 🚧

* [ ] Real-time notifications (WebSocket)
* [ ] Rich text editor (TinyMCE/Quill)
* [ ] Image upload (Cloudinary)
* [ ] Advanced search & filters
* [ ] Email queue system

### **Phase 3 (Future)** 🔮

* [ ] Multi-language support (i18n)
* [ ] Mobile app (React Native)
* [ ] SEO optimization
* [ ] Analytics dashboard v2
* [ ] AI-powered content suggestions

---

## 🤝 **Contributing**

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### **Contribution Guidelines**

* Follow existing code style
* Write meaningful commit messages
* Add tests for new features
* Update documentation

---

## 📝 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 💬 **Support & Contact**

* **Email**: [hemanths7.dev@gmail.com](mailto:hemanths7.dev@gmail.com)
* **Issues**: [GitHub Issues](https://github.com/hemanthscode/penthread/issues)
* **Discussions**: [GitHub Discussions](https://github.com/hemanthscode/penthread/discussions)

---

## 🙏 **Acknowledgments**

* React team for the amazing framework
* Express.js community
* MongoDB for flexible data modeling
* Tailwind CSS for beautiful styling
* All open-source contributors

---

## ⭐ **Show Your Support**

If you find PenThread helpful, please give it a ⭐ on GitHub!

---

**🚀 Built with MERN, designed for scale, crafted with care.**
**Made by developers, for developers and content creators.**
