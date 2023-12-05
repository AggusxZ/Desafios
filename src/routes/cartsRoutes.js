const express = require('express');
const CartManager = require('../managers/CartManager');

const cartsRouter = express.Router();
const cartManager = new CartManager('../../carts.json');

let carts = [];

cartsRouter.post('/', async (req, res) => {
  try {
    const newCartId = generateUniqueId(); 
    await cartManager.addToCart(newCartId); 
    return res.status(201).json({ message: 'New cart created', cartId: newCartId });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

cartsRouter.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cartProducts = await cartManager.getCartProducts(cid);

    if (!cartProducts) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    return res.json(cartProducts);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cartProducts = await cartManager.addToCart(cid, pid);

    if (!cartProducts) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    return res.status(201).json({ message: 'Product added to cart' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = cartsRouter;