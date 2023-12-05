const fs = require('fs/promises');

class CartManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async addToCart(cartId, productId) {
    try {
      const carts = await this.readCarts();
      let cart = carts.find(c => c.id === cartId);

      if (!cart) {
        cart = {
          id: cartId,
          products: []
        };
        carts.push(cart);
      }

      const productIndex = cart.products.findIndex(p => p.productId === productId);

      if (productIndex !== -1) {
        
        cart.products[productIndex].quantity += 1;
      } else {
        
        const products = await this.readProducts();
        const product = products.find(p => p.id === productId);

        if (!product) {
          throw new Error('El producto no existe');
        }

        cart.products.push({ productId, quantity: 1 });
      }

      await this.writeCarts(carts);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      throw error;
    }
  }

  async readCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data) || [];
    } catch (error) {
      console.error('Error al leer el archivo de carritos:', error);
      return [];
    }
  }

  async writeCarts(carts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error al escribir en el archivo de carritos:', error);
      throw error;
    }
  }

  async readProducts() {
    try {
      const productsFilePath = '../../productos.json';
      const data = await fs.readFile(productsFilePath, 'utf-8');
      return JSON.parse(data) || [];
    } catch (error) {
      console.error('Error al leer el archivo de productos:', error);
      return [];
    }
  }
}

module.exports = CartManager;