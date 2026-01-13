# 📝 **PenThread - Frontend Documentation**

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge\&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge\&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge\&logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-State-000000?style=for-the-badge)
![React Router](https://img.shields.io/badge/React_Router-6.x-CA4245?style=for-the-badge\&logo=reactrouter)

---

## 🎯 **Mission Statement**

Build a **modern, responsive, and accessible** blog platform frontend with:
✅ *Clean UI/UX* ✅ *Real-time Updates* ✅ *Role-based Views* ✅ *Production-ready Components*

Designed for **seamless content creation, discovery, and engagement** with full integration to a RESTful backend API.

---

## 🗂️ **Project Structure**

```bash
📦 src/
│
├── 📁 components/          # 🧬 Reusable UI components
│   ├── common/             # Buttons, Inputs, Modals, Cards, Badges
│   ├── layout/             # Header, Footer, Sidebar, Container
│   └── posts/              # PostCard, CommentSection, CommentItem
│
├── 📁 pages/               # 📄 Route-based page components
│   ├── auth/               # Login, Register, ForgotPassword
│   ├── posts/              # PostList, PostDetail, CreatePost, EditPost
│   ├── dashboard/          # UserDashboard, AuthorDashboard, AdminDashboard
│   ├── categories/         # CategoryList
│   └── tags/               # TagList
│
├── 📁 hooks/               # 🪝 Custom React hooks
│   ├── useAuth.js          # Authentication state management
│   ├── useComments.js      # Comment fetching and moderation
│   ├── usePosts.js         # Post management
│   ├── useCategories.js    # Category operations
│   └── useTags.js          # Tag operations
│
├── 📁 services/            # 🌐 API service layer
│   ├── api.js              # Axios instance with interceptors
│   ├── authService.js      # Auth endpoints
│   ├── postService.js      # Post CRUD operations
│   ├── commentService.js   # Comment moderation
│   └── dashboardService.js # Analytics data
│
├── 📁 store/               # 📔️ Zustand state management
│   ├── useAuthStore.js     # Global auth state
│   ├── usePostStore.js     # Posts state
│   ├── useCommentStore.js  # Comments state
│   └── useNotificationStore.js  # Notifications
│
├── 📁 context/             # ⚛️ React Context providers
│   ├── AuthContext.jsx     # Auth context wrapper
│   ├── ThemeContext.jsx    # Dark/Light mode
│   └── ToastContext.jsx    # Toast notifications
│
├── 🔧 utils/               # 🛠️ Utility functions
│   ├── constants.js        # App-wide constants
│   ├── helpers.js          # Date formatting, validation
│   └── validation.js       # Form validation rules
│
├── 🎨 App.jsx              # Root component with routing
├── 🚀 main.jsx             # React DOM entry point
├── ⚙️ index.css            # Global styles + Tailwind imports
└── 📦 vite.config.js       # Vite configuration
```

---

## 🎨 **Feature Overview**

| 🎯 Feature            | 🌟 Capabilities                       | 🔐 Auth | 🎭 Role-Based | ✅ Status |
| --------------------- | ------------------------------------- | :-----: | :-----------: | :------: |
| **Authentication**    | Login, Register, JWT token refresh    |    ✨    |       ✨       |     ✅    |
| **Posts**             | Browse, Search, Filter, Create, Edit  |    ✨    |       ✨       |     ✅    |
| **Comments**          | Create, View, Moderate (Author/Admin) |    ✨    |       ✨       |     ✅    |
| **Interactions**      | Like, Favorite, View count tracking   |    ✨    |       ❌       |     ✅    |
| **Dashboard**         | User/Author/Admin analytics views     |    ✨    |       ✨       |     ✅    |
| **Categories & Tags** | CRUD operations (Author/Admin)        |    ✨    |       ✨       |     ✅    |
| **Notifications**     | Real-time updates, mark as read       |    ✨    |       ❌       |     ✅    |
| **Dark Mode**         | System-aware theme toggle             |    ❌    |       ❌       |     ✅    |
| **Responsive Design** | Mobile-first, tablet, desktop         |    ❌    |       ❌       |     ✅    |

---

## ⚡ **Tech Stack**

### **Core Framework**

* **React 18.x** - Component-based UI library
* **Vite 5.x** - Fast build tool and dev server
* **React Router 6.x** - Client-side routing

### **Styling & UI**

* **Tailwind CSS 3.x** - Utility-first CSS framework
* **Framer Motion** - Animation library
* **Lucide React** - Modern icon library

### **State Management**

* **Zustand** - Lightweight state management
* **React Context API** - Auth and theme context

### **HTTP & API**

* **Axios** - HTTP client with interceptors
* **React Hot Toast** - Toast notifications

### **Form Handling**

* **Custom useForm hook** - Form state and validation

---

## 🚀 **Quick Start Guide**

### **1️⃣ Prerequisites**

```bash
Node.js >= 18.x
npm >= 9.x
```

### **2️⃣ Install Dependencies**

```bash
npm install
```

### **3️⃣ Configure Environment**

```bash
cp .env.sample .env
# Set VITE_API_BASE_URL=http://localhost:4000/api
```

### **4️⃣ Start Development Server**

```bash
npm run dev
# App runs on http://localhost:5173
```

### **5️⃣ Build for Production**

```bash
npm run build
npm run preview  # Preview production build
```

---

## 🧬 **Component Architecture**

### **Common Components**

* `Button` - Multi-variant button with loading states
* `Input` - Form input with validation display
* `Modal` - Reusable modal dialog
* `Card` - Content card with hover effects
* `Badge` - Status and tag badges
* `Avatar` - User avatar with fallback

### **Layout Components**

* `Container` - Responsive content wrapper
* `PageHeader` - Page title with actions
* `Breadcrumbs` - Navigation breadcrumbs
* `DashboardLayout` - Sidebar + main content

### **Post Components**

* `PostCard` - Post preview card
* `CommentSection` - Comments list with moderation
* `CommentItem` - Individual comment with actions

---

## 🔐 **Authentication Flow**

1. User logs in → JWT token received
2. Token stored in `localStorage` and `useAuthStore`
3. Axios interceptor attaches token to all requests
4. Protected routes check auth state
5. Token refresh on 401 errors
6. Auto-logout on invalid/expired tokens

---

## 🎭 **Role-Based Access Control**

| Role       | Permissions                                       |
| ---------- | ------------------------------------------------- |
| **User**   | View posts, comment, like, favorite               |
| **Author** | Create/edit own posts, moderate own post comments |
| **Admin**  | Full access, user management, all moderation      |

---

## 🌈 **Pages Overview**

### **Public Pages**

* `/` - Home/Landing page
* `/posts` - Browse all posts
* `/posts/:id` - Post detail view
* `/login` - User login
* `/register` - User registration

### **Protected Pages**

* `/dashboard` - Role-based dashboard redirect
* `/posts/create` - Create new post (Author/Admin)
* `/posts/:id/edit` - Edit post (Owner/Admin)
* `/categories` - Manage categories (Author/Admin)
* `/tags` - Manage tags (Author/Admin)

---

## 🛯️ **Best Practices Implemented**

✅ **Code Quality**

* Component composition over inheritance
* Custom hooks for reusable logic
* Service layer abstraction for API calls
* Consistent error handling

✅ **Performance**

* Lazy loading for routes
* Optimistic UI updates
* Debounced search inputs
* Memoized expensive computations

✅ **Accessibility**

* Semantic HTML elements
* ARIA labels and roles
* Keyboard navigation support
* Screen reader friendly

✅ **Security**

* XSS protection via React's JSX escaping
* CSRF token handling (if implemented)
* Secure token storage
* Input sanitization

---

## 🧪 **Testing Recommendations**

```bash
# Unit tests (to be implemented)
npm run test

# E2E tests with Playwright (to be implemented)
npm run test:e2e
```

---

## 📦 **Build & Deployment**

### **Environment Variables**

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_APP_NAME=PenThread
```

### **Deployment Platforms**

* ✅ Vercel (recommended)
* ✅ Netlify
* ✅ AWS Amplify
* ✅ GitHub Pages (static)

### **Build Command**

```bash
npm run build
# Output: dist/
```

---

## 🎨 **Theming & Customization**

### **Tailwind Config**

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { /* custom brand colors */ }
      }
    }
  }
}
```

### **Dark Mode**

* System preference detection
* Manual toggle with persistence
* Smooth theme transitions

---

## 🔮 **Future Enhancements**

* 🔔 Real-time notifications via WebSocket
* 📸 Image upload with preview
* 🔍 Advanced search with filters
* 📊 Rich text editor (TinyMCE/Quill)
* 🌍 Internationalization (i18n)
* ♿ Enhanced accessibility (WCAG AAA)
* 🧪 Comprehensive test coverage

---

## 💡 **Tips for Developers**

1. **State Management**: Use Zustand for global state, local state for UI-only
2. **API Calls**: Always use service layer, never direct axios in components
3. **Forms**: Leverage `useForm` hook for consistent validation
4. **Styling**: Use Tailwind classes, avoid inline styles
5. **Icons**: Import only used icons from Lucide React

---

## 🏁 **Success Metrics**

| Metric                | Target  |
| --------------------- | ------- |
| ⚡ Lighthouse Score    | 90+     |
| 📱 Mobile Responsive  | 100%    |
| ♿ Accessibility       | WCAG AA |
| 🎨 Visual Consistency | 95%+    |

---

## 💖 **Contributing**

Found a bug? Want to improve the UI?
Open an issue or submit a PR!

---

**🎨 Built with React, styled with Tailwind, powered by passion.**
