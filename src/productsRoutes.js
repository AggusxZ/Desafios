const express = require('express');
const path = require('path');
const ProductManager = require('./ProductManager'); 

const productsRouter = express.Router();
const productManager = new ProductManager(path.resolve(__dirname, '../productos.json'));

productsRouter.get('/', async (req, res) => {
    try {
      const { limit } = req.query;
      const products = await productManager.getProducts();
  
      if (limit) {
        const limitedProducts = products.slice(0, parseInt(limit, 10));
        return res.json(limitedProducts);
      }
  
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await productManager.getProductById(parseInt(pid, 10));
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      return res.json(product);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});

productsRouter.post('/', async (req, res) => {
    try {
      const newProduct = req.body;
      await productManager.addProduct(newProduct);
      return res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
productsRouter.put('/:pid', async (req, res) => {
    try {
      const { pid } = req.params;
      const updatedProduct = req.body;
      await productManager.updateProduct(parseInt(pid, 10), updatedProduct);
      return res.json({ message: 'Product updated successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
productsRouter.delete('/:pid', async (req, res) => {
    try {
      const { pid } = req.params;
      await productManager.deleteProduct(parseInt(pid, 10));
      return res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = productsRouter;