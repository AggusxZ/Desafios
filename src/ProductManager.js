const fs = require('fs/promises');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async addProduct(product) {
    try {
      const products = await this.readProducts();
      product.id = this.generateId(products);
      products.push(product);
      await this.writeProducts(products);
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      throw error;
    }
  }

  async getProducts() {
    try {
      return await this.readProducts();
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const products = await this.readProducts();
      return products.find(product => product.id === id);
    } catch (error) {
      console.error('Error al obtener el producto por ID:', error);
      return null;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      let products = await this.readProducts();
      const index = products.findIndex(product => product.id === id);

      if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        await this.writeProducts(products);
      } else {
        console.error('Producto no encontrado para actualizar.');
      }
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      let products = await this.readProducts();
      products = products.filter(product => product.id !== id);
      await this.writeProducts(products);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      throw error;
    }
  }

  async readProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      const parsedData = JSON.parse(data);
      return parsedData || [];
    } catch (error) {
      console.error('Error al leer el archivo:', error);
      return [];
    }
  }

  async writeProducts(products) {
    try {
      await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error al escribir el archivo:', error);
      throw error;
    }
  }

  generateId(products) {
    return products.length > 0 ? products[products.length - 1].id + 1 : 1;
  }
}

module.exports = ProductManager;
  