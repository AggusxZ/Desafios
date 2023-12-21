const fs = require('fs/promises');
const io = require('socket.io')();
const Product = require('./models/product.model')

class ProductManager {
  constructor(filePath, io) {
    this.path = filePath;
    this.io = io;
  }

  async addProduct(product) {
    try {
      const newProduct = new Product({
        name: product.name,
        price: product.price,
        description: product.description,
      });
  
      await newProduct.save();
      
      this.io.emit('productoAgregado', newProduct);
      
      return newProduct; 
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      throw error;
    }
  }

  async getProducts() {
    try {
      return await Product.find({});
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      console.error('Error al obtener el producto por ID:', error);
      return null;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      return await Product.findByIdAndUpdate(id, updatedProduct, { new: true });
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      throw error;
    }
  }
  
  async deleteProduct(id) {
    try {
      return await Product.findByIdAndDelete(id);
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
  