class ProductManager {
    constructor() {
      this.products = [];
      this.productIdCounter = 1; 
    }
  
    addProduct(title, description, price, thumbnail, code, stock) {
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.error("Todos los campos son obligatorios.");
        return;
      }
  
      const codeExists = this.products.some(product => product.code === code);
      if (codeExists) {
        console.error("El código del producto ya existe.");
        return;
      }
  
      const newProduct = {
        id: this.productIdCounter,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      };
      this.products.push(newProduct);
      this.productIdCounter++; 
    }
  
    getProducts() {
      return this.products;
    }
  
    getProductById(id) {
      const product = this.products.find(product => product.id === id);
      if (!product) {
        console.error("Producto no encontrado");
      }
      return product;
    }
  }
  