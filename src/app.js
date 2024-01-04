const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');

const productsRouter = require('./routes/productsRoutes');
const cartsRouter = require('./routes/cartsRoutes');
const viewsRouter = require('./routes/viewsRoutes');

const connectDB = require ('./config/db')

const app = express();
const PORT = 8080;
const filePath = path.resolve(__dirname, '../productos.json');

connectDB()

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
app.use('/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Creación del servidor HTTP
const server = http.createServer(app);
const io = socketIO(server);

// Manejo de WebSockets
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});