const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');
const Discount = require('./models/discountModel');
const products = require('./data/products');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Discount.deleteMany();

    // Create admin + test user
    await User.create([
      { name: 'Admin User', email: 'admin@ethereal.com', password: 'password123', isAdmin: true, isVerified: true },
      { name: 'John Doe', email: 'john@example.com', password: 'password123', isAdmin: false, isVerified: true }
    ]);

    // Insert products
    await Product.insertMany(products);

  

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Discount.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
