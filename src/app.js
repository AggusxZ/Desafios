const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');

const productsRouter = require('./routes/productsRoutes');
const cartsRouter = require('./routes/cartsRoutes');
const ProductManager = require('./ProductManager');

const { connect } = require('mongoose')

const app = express();
const PORT = 8080;
const filePath = path.resolve(__dirname, '../productos.json');

const connectDb = async () => {
  await connect('mongodb+srv://AggusxZ:rvUh4qLAg6JzENe6@cluster0.46mdk2n.mongodb.net/tiendadejuegos?retryWrites=true&w=majority')
  console.log('Base de datos conectada')
}
connectDb()

// Configuración de Handlebars 
app.engine('handlebars', exphbs.engine({
  layoutsDir: path.join(__dirname, '../views/layouts/'), 
  extname: 'handlebars', 
  defaultLayout: 'home', 
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

// Middlewares
app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Creación del servidor HTTP
const server = http.createServer(app);
const io = socketIO(server);

// Manejo de WebSockets
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
});

// Instancia de ProductManager 
const productManager = new ProductManager(filePath, io);

// Ruta para mostrar productos (ejemplo de productos desde un archivo JSON)
app.get('/', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      return;
    }
    res.send(data);
  });
});

// Ruta para renderizar la vista 'home.handlebars'
app.get('/home', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('layouts/home', { products }); 
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.render('layouts/error', { error: 'Error al obtener los productos' });
  }
});

// Ruta para renderizar la vista 'realTimeProducts.handlebars'
app.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('layouts/realTimeProducts', { products }); 
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.render('layouts/error', { error: 'Error al obtener los productos' });
  }
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});