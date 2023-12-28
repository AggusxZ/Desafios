const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, category, availability } = req.query;

    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (availability) {
      filter.availability = availability;
    }

    const sortOptions = {};
    if (sort === 'asc') {
      sortOptions.price = 1;
    } else if (sort === 'desc') {
      sortOptions.price = -1;
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort(sortOptions)
      .limit(limit)
      .skip(skip);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    res.render('products', { products, totalPages });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

