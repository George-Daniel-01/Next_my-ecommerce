# 🛒 E-Commerce Next.js Full Stack App

A full-stack e-commerce application built with Next.js 16, PostgreSQL, Redux Toolkit, Stripe, Cloudinary, and Gemini AI.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS v3, Redux Toolkit
- **Backend**: Next.js API Routes (no separate Express server)
- **Database**: PostgreSQL
- **Auth**: JWT (HttpOnly cookies)
- **Payments**: Stripe
- **Image Upload**: Cloudinary
- **AI Search**: Google Gemini
- **Email**: Nodemailer

---

## 📁 Project Structure
```
ecommerce-nextjs/
├── app/
│   ├── (store)/          # Store frontend pages
│   │   ├── products/     # All products page
│   │   ├── product/[id]/ # Single product page
│   │   ├── cart/         # Cart page
│   │   ├── orders/       # My orders page
│   │   ├── payment/      # Payment page
│   │   └── about/        # About page
│   ├── admin/            # Admin dashboard
│   │   ├── login/        # Admin login page
│   │   ├── components/   # Dashboard, Orders, Products, Users, Profile
│   │   ├── modals/       # Create, Update, View product modals
│   │   └── lib/          # Admin helper functions
│   ├── api/v1/           # All backend API routes
│   │   ├── auth/         # Login, Register, Logout, Me, Password
│   │   ├── product/      # CRUD + Admin product routes
│   │   ├── order/        # Order routes
│   │   ├── admin/        # Admin stats, users routes
│   │   └── payment/      # Stripe payment routes
│   ├── components/       # Shared components (Navbar, Footer, etc.)
│   ├── contexts/         # ThemeContext
│   ├── store/            # Redux store + all slices
│   └── lib/              # Utility functions (db, auth, cloudinary, etc.)
├── public/               # Static assets (images)
└── .env.local            # Environment variables (see below)
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root of the project with the following:
```env
# ─────────────────────────────────────
# DATABASE
# ─────────────────────────────────────
DATABASE_URL=postgresql://username:password@localhost:5432/ecommerce_db

# ─────────────────────────────────────
# JWT AUTH
# ─────────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# ─────────────────────────────────────
# CLOUDINARY (Image Uploads)
# ─────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ─────────────────────────────────────
# STRIPE (Payments)
# ─────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# ─────────────────────────────────────
# GOOGLE GEMINI AI (Search)
# ─────────────────────────────────────
GEMINI_API_KEY=your_gemini_api_key

# ─────────────────────────────────────
# EMAIL (Nodemailer - Password Reset)
# ─────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password

# ─────────────────────────────────────
# APP URL
# ─────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ecommerce-nextjs.git
cd ecommerce-nextjs
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
```bash
cp .env.example .env.local
# Fill in your values in .env.local
```

### 4. Setup PostgreSQL Database
```bash
# Make sure PostgreSQL is running
# Create database
createdb ecommerce_db

# Tables are auto-created on first run via lib/db.js
```

### 5. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the store.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard.

---

## 👤 Admin Access

1. Go to `http://localhost:3000/admin/login`
2. Login with an account that has `role = "Admin"` in the database
3. To make a user admin, run this SQL:
```sql
UPDATE users SET role = 'Admin' WHERE email = 'your@email.com';
```

---

## 🗄️ Database Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts with roles (User/Admin) |
| `products` | Product listings |
| `product_images` | Cloudinary image URLs per product |
| `reviews` | Product reviews |
| `orders` | Customer orders |
| `order_items` | Items within each order |
| `password_resets` | Password reset tokens |

---

## 🔗 API Routes

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/auth/logout` | Logout |
| GET | `/api/v1/auth/me` | Get current user |
| PUT | `/api/v1/auth/profile/update` | Update profile |
| PUT | `/api/v1/auth/password/update` | Update password |
| POST | `/api/v1/auth/password/forgot` | Forgot password |
| PUT | `/api/v1/auth/password/reset/:token` | Reset password |

### Products
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/v1/product` | Get all products (with filters) |
| GET | `/api/v1/product/:id` | Get single product |
| POST | `/api/v1/product/admin/create` | Create product (Admin) |
| PUT | `/api/v1/product/admin/update/:id` | Update product (Admin) |
| DELETE | `/api/v1/product/admin/delete/:id` | Delete product (Admin) |

### Orders
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/v1/order/create` | Place new order |
| GET | `/api/v1/order/myorders` | Get my orders |
| GET | `/api/v1/order/admin/getall` | Get all orders (Admin) |
| PUT | `/api/v1/order/admin/update/:id` | Update order status (Admin) |
| DELETE | `/api/v1/order/admin/delete/:id` | Delete order (Admin) |

### Admin
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/v1/admin/fetch/dashboard-stats` | Get dashboard statistics |
| GET | `/api/v1/admin/getallusers` | Get all users (paginated) |
| DELETE | `/api/v1/admin/delete/:id` | Delete user |

### Payments
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/v1/payment/process` | Process Stripe payment |
| GET | `/api/v1/payment/stripekey` | Get Stripe publishable key |

---

## ✅ Features

### Store (Customer)
- 🔐 Register / Login / Logout
- 🔍 Search products with AI (Gemini)
- 🛍️ Browse products with filters (category, price, rating)
- 📦 Product detail with reviews
- 🛒 Shopping cart
- 💳 Stripe payment integration
- 📋 Order history
- 👤 Profile management
- 🌙 Dark/Light theme toggle

### Admin Dashboard
- 📊 Dashboard with charts (sales, orders, top products)
- 📋 Order management (view, update status, delete)
- 📦 Product management (create with images, update, delete, view)
- 👥 User management (view, delete)
- 👤 Profile & password update
- 📈 Revenue stats and growth tracking

---

## 🧰 Key Libraries
```json
{
  "next": "16.x",
  "react": "19.x",
  "tailwindcss": "3.x",
  "@reduxjs/toolkit": "latest",
  "axios": "latest",
  "stripe": "latest",
  "@stripe/react-stripe-js": "latest",
  "cloudinary": "latest",
  "pg": "latest",
  "jsonwebtoken": "latest",
  "bcryptjs": "latest",
  "nodemailer": "latest",
  "recharts": "latest",
  "lucide-react": "latest",
  "react-toastify": "latest",
  "react-hot-toast": "latest"
}
```

---

## 📝 Notes

- All API routes are inside `app/api/v1/` — no separate Express server needed
- Admin routes are protected by JWT middleware checking `role === "Admin"`
- Images are uploaded to Cloudinary and stored as URLs in PostgreSQL
- Tailwind v3 is used (not v4) for compatibility
- The store frontend uses dark/navy theme with glassmorphism
- The admin dashboard uses a clean white theme

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT License