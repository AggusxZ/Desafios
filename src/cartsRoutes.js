const express = require('express');

const cartsRouter = express.Router();

let carts = [];

cartsRouter.post('/', (req, res) => {
    try {
      const newCart = {
        id: generateUniqueId(), 
        products: [] 
      };
      carts.push(newCart); 
      return res.status(201).json({ message: 'New cart created', cartId: newCart.id });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});

cartsRouter.get('/:cid', (req, res) => {
    try {
      const { cid } = req.params;
      const cart = carts.find(cart => cart.id === cid);
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      return res.json(cart.products);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
cartsRouter.post('/:cid/product/:pid', (req, res) => {
    try {
      const { cid, pid } = req.params;
      const cart = carts.find(cart => cart.id === cid);
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      cart.products.push({ productId: pid });
  
      return res.status(201).json({ message: 'Product added to cart' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = cartsRouter;