# Ethereal Skincare - E-commerce Platform

A full-stack, production-ready MERN e-commerce application built to replicate a modern Shopify storefront. 

## 🌐 Live Demo
- **Frontend (Storefront):** [https://ethereal-5.onrender.com/](https://ethereal-5.onrender.com/)
- **Backend (API):** [https://ethereal-5x0p.onrender.com](https://ethereal-5x0p.onrender.com)
  - *Note: The backend may take up to 50 seconds to spin up on the first request if it has been inactive.*

## 🚀 Features

### Customer Features (Frontend)
- **Responsive "Dawn" Theme Design**: Clean, minimalist UI optimized for mobile and desktop.
- **Product Catalog**: Dynamic catalog with category filtering and sorting.
- **Product Pages**: Image galleries, variant selection, simulated customer reviews.
- **Cart & Checkout**: Integrated slide-out cart drawer, dynamic discount code application, and dummy Stripe checkout.
- **User Accounts**: Registration with Email OTP verification, login, and visual order tracking history.
- **Trust Signals & SEO**: Meta tags generated dynamically, sticky add-to-cart, free shipping threshold indicator.
- **Announcement Bar**: Fetches and displays the most recent active promotional discount automatically.

### Administrator Features (Backend Dashboard)
- **Sales Analytics**: 7-day visual line chart for revenue, total orders, and user count.
- **Product Management**: Full CRUD interface.
- **Bulk Import**: Support for importing hundreds of products instantly via CSV upload.
- **Discount Engine**: Admins can generate custom promotional codes (Percentage, Fixed Amount, Free Shipping) that immediately publicize to the storefront.
- **Sidekick AI Simulator**: Simulated AI assistant for writing SEO meta descriptions, improving copy, and suggesting UI layouts.

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, React Router, Recharts, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs, Nodemailer (OTP)
- **APIs**: Stripe (Payment integration - Test Mode)

## 📦 Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/pankajkumar9771369/ethereal.git
cd ethereal
```

2. **Backend Setup**
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_test_key
EMAIL_USER=your_smtp_email
EMAIL_PASS=your_smtp_app_password
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Run the Application**
Open two terminals.
Terminal 1 (Backend): `npm run server` or `node server.js`
Terminal 2 (Frontend): `npm run dev`

## 👨‍💻 Author
Pankaj Kumar
