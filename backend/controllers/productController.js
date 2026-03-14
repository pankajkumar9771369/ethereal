const Product = require('../models/productModel');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a single product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      comparePrice: req.body.comparePrice,
      user: req.user._id,
      image: req.body.image,
      category: req.body.category,
      countInStock: req.body.countInStock,
      description: req.body.description,
      volume: req.body.volume,
      benefits: req.body.benefits,
      sku: req.body.sku,
      vendor: req.body.vendor,
      shippingInfo: req.body.shippingInfo,
      tags: req.body.tags,
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk create products
// @route   POST /api/products/bulk
// @access  Private/Admin
const createBulkProducts = async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products provided' });
    }

    const productsWithUser = products.map(p => ({ ...p, user: req.user._id }));

    // Insert many
    const createdProducts = await Product.insertMany(productsWithUser);
    res.status(201).json({ message: 'Products imported', count: createdProducts.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  createBulkProducts,
  deleteProduct,
};
