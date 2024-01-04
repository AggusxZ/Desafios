const express = require('express');
const productsRouter = express.Router();
const productController = require('../controllers/product/productController');

productsRouter.get('/', productController.getProducts);
productsRouter.get('/:pid', productController.getProductById);
productsRouter.post('/', productController.addProduct);

module.exports = productsRouter;


