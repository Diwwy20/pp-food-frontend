# 🍔 PP Food Web App

**PP Food** is a comprehensive full-stack food ordering platform designed to bridge the gap between customers and restaurant management. It features a robust **Authentication System** and a dynamic **Content Management System (CMS)** for real-time menu updates.

Users can enjoy a seamless experience from registration to menu browsing, while administrators have full control over the restaurant's offerings through a dedicated dashboard.

- 🔐 **Secure Identity**: Verified accounts via Email OTP & Password recovery support.
- 🛒 **Dynamic Cart**: Users can browse menus and manage their shopping cart in real-time.
- 👨‍🍳 **Admin Power**: Full CRUD capabilities for Menus, Categories, and Add-ons.

---

## 🚀 Features

### 👤 User & Authentication
- **Secure Registration**: Sign up with email verification (OTP via SMTP).
- **Profile Management**: Update user profile information and avatars.
- **Account Recovery**: Secure "Forgot Password" flow via email.
- **Menu Browsing**: Explore dishes by categories (e.g., Main, Appetizers, Drinks).
- **Cart**: Add items with add-on options and manage cart quantities.

### 🛡️ Admin & CMS
- **Menu Management**: Create, edit, and delete food items.
- **Category Control**: Manage food categories (e.g., Main Course, Beverages).
- **Add-on System**: Configure extra options for specific menu items.
- **Image Handling**: Upload and manage food images.

---

## 🛠 Tech Stack

- **Frontend**: Next.js (App Router) + TypeScript
- **UI & Styling**: TailwindCSS + shadcn/ui
- **Backend**: Node.js + Express + TypeScript
- **Database**: MySQL
- **Services**: Nodemailer (SMTP) Email Template
- **Deployment**: Netlify (Frontend), Railway (Backend)

---

## 📦 How to Run the Project

Follow the steps below to run the **Frontend** locally:

```bash
# 1. Clone the repository
git clone https://github.com/Diwwy20/pp-food-frontend

# 2. Install dependencies
pnpm install

# 3. Create a `.env` file in the root directory and add your API keys:
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
NEXT_PUBLIC_IMAGE_URL="http://localhost:5000"

# 4. Start the development server (http://localhost:3000)
pnpm run dev
```

## 🌍 Live Demo

Experience the platform live — no setup needed!
👉 [https://pp-food.netlify.app/](https://pp-food.netlify.app/)

The app is fully deployed and ready to explore.
You can create an account, browse quotes, and view your personal dashboard right away.

🔐 Test Credentials
You can use these accounts to test the Admin CMS and User Features:

👑 Admin Accounts (Admin Access)

Email: admin1@gmail.com  Pass: 123456Ab

Email: admin2@gmail.com  Pass: 123456Ab

👤 User Accounts (Customer View)

Email: user1@gmail.com  Pass: 123456Ab

Email: user2@gmail.com  Pass: 123456Ab

Email: user3@gmail.com  Pass: 123456Ab
