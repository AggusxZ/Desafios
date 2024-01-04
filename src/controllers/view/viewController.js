const productDao = require('../../daos/productDao');

const renderHome = async (req, res) => {
  try {
    const products = await productDao.getSpecificProductData();
    console.log('Productos para la vista home:', products); 

    res.render('layouts/home', { products }); 
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.render('layouts/error', { error: 'Error al obtener los productos' });
  }
};

const renderRealTimeProducts = async (req, res) => {
  try {
    const products = await productDao.getProducts();
    console.log('Productos para la vista realTimeProducts:', products);
    res.render('layouts/realTimeProducts', { products }); 
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.render('layouts/error', { error: 'Error al obtener los productos' });
  }
};

module.exports = {
  renderHome,
  renderRealTimeProducts
};
