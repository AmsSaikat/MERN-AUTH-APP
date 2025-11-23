MERN Authentication System (JWT + Email Verification + Password Reset)

A complete MERN stack authentication system featuring:

✔ Secure user registration
✔ Email verification with OTP
✔ Login with JWT & HTTP-only cookies
✔ Forgot password + email reset link
✔ Protected routes
✔ ZUSTAND global auth store
✔ Modern UI (React + Tailwind + Framer Motion)
✔ Fully production-ready structure

🚀 Features
🔐 Authentication

Register new users

Login with JWT (stored in HTTP-only cookies)

Logout securely

Auto-login (token validation)

✉ Email Verification

Sends 6-digit OTP to user email

User must verify before access

Protected route for unverified users

Resend verification supported

🔑 Password Reset

Forgot password email with reset link

Secure token-based reset

Frontend reset password page

🛡 Security

bcrypt password hashing

HTTP-Only cookies (prevents XSS token theft)

Environment variables protected

Validators for email/password

Throttled requests

🧩 Frontend (React)

Zustand global store

Framer Motion animations

Modern glassmorphism UI

OTP input UI

Error + success message handling

Protected + Redirect routes

Responsive layout

⚙ Backend (Node.js + Express)

MongoDB with Mongoose

Auth routes

Email service using Nodemailer

OTP + Token models

Middleware validations
