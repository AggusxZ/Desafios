const express = require('express');
const path = require('path');
const fs = require('fs');

const productsRouter = require('./productsRoutes');
const cartsRouter = require('./cartsRoutes');

const app = express();
const PORT = 8080;
const filePath = path.resolve(__dirname, '../productos.json');

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      return;
    }
    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});