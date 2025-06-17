# Social Media App — Authentication + Email 2FA + React 19 Features (WIP 🛠️)

A full-stack social media app built with **Next.js 14** and modern React 19 features.  
Focus on **authentication**, **2FA**, **smooth UI/UX with animations**, and **modern server/client rendering patterns**.

---

## ✅ Implemented

- 🔐 Full authentication flow with **Auth.js**
- 📧 **2FA via email** using **Resend**
- 🛢️ MongoDB + Prisma ORM
- 💅 Responsive UI with **Tailwind CSS**
- ⚛️ **React 19**:
    - `use()` for async rendering
    - `<Suspense>` for data & UI loading
    - `useOptimistic()` for optimistic updates
- 🧩 Animations with **Framer Motion**
- 📦 Modular and scalable folder structure

---

## 🧪 Tech Stack

- **Next.js 14 (App Router, Server Components)**
- **React 19 (use, useOptimistic, Suspense)**
- **TypeScript**
- **Auth.js (NextAuth)** — secure session-based auth
- **Resend.js** — transactional email for 2FA
- **UploadThing** — for file uploads
- **MongoDB + Prisma**
- **Tailwind CSS + Framer Motion**

---

## 🖼️ UI/UX

- Clean design with interactive motion-based transitions
- Page and component-level animations using Framer Motion
- Smooth loading states with Suspense
- Optimistic UI updates for instant feedback

---

## File Uploads

This app uses [UploadThing](https://uploadthing.com/) to handle file uploads securely and efficiently. UploadThing manages the upload flow and callbacks to the API.

---

## 📌 Features in Progress

- User profiles (avatar, bio, etc.)
- Public & private posts
- Follows/followers logic
- Commenting & reactions
- Notifications system
- Real-time chat (WebSocket)
- Image uploads
- Mobile layout and responsive improvements

---

## Screenshots

![Preview](public/screenshots/login-page.png)

### Sign in page

![Login Page](public/screenshots/login-page.png)

### Register page

![Register Page](public/screenshots/register-page.png)

### Register with verification

![Register Verification](public/screenshots/register-page-show-case-1.png)

### Friends page

![Friends Page](public/screenshots/friends-page-show-case-2.png)

### Friends page. With optimistic updates

![Friends Optimistic Actions 1](public/screenshots/friends-page-show-case-1.png)
![Friends Optimistic Actions 2](public/screenshots/friends-page-show-case-3.png)

### New verification page

![New Verification](public/screenshots/new-verification-page.png)

### Settings page

![Settings Page](public/screenshots/settings-page.png)

### Settings. Update user image

![Settings Update Image](public/screenshots/settings-page-show-case-1.png)
![Settings Update Image](public/screenshots/settings-page-show-case-2.png)

### Theme Menu & Toggle component using Framer Motion

![Theme Menu](public/screenshots/theme-menu.png)

---

## 🧪 Getting Started

```bash
git clone https://github.com/your-username/social-media-app.git
cd social-media-app
npm install
```
