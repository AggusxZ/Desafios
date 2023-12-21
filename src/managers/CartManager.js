const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

class CartManager {
  async addToCart(cartId, productId) {
    try {
      let cart = await Cart.findOne({ cartId });

      if (!cart) {
        cart = new Cart({ cartId, products: [] });
      }

      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        const product = await Product.findById(productId);

        if (!product) {
          throw new Error('El producto no existe');
        }

        cart.products.push({ productId: product._id, quantity: 1 });
      }

      await cart.save();
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      throw error;
    }
  }

  async readCarts() {
    try {
      return await Cart.find({});
    } catch (error) {
      console.error('Error al obtener los carritos:', error);
      return [];
    }
  }

  /* async writeCarts(carts) {
    try {
      console.warn('writeCarts no está implementado para Mongoose.');
    } catch (error) {
      console.error('Error al escribir en los carritos:', error);
      throw error;
    }
  } */

}

module.exports = CartManager;