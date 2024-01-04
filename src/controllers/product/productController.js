const productDao = require('../../daos/productDao');

const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const products = await productDao.getProducts();

    let filteredProducts = [...products]; 

    if (sort === 'asc' || sort === 'desc') {
      filteredProducts.sort((a, b) => {
        if (sort === 'asc') {
          return a.price - b.price; 
        } else {
          return b.price - a.price; 
        }
      });
    }

    const startIdx = (page - 1) * limit;
    const endIdx = startIdx + parseInt(limit, 10);
    const paginatedProducts = filteredProducts.slice(startIdx, endIdx);

    const totalPages = Math.ceil(filteredProducts.length / limit);
    const hasNextPage = endIdx < filteredProducts.length;
    const hasPrevPage = page > 1;

    const response = {
      status: 'success',
      payload: paginatedProducts,
      totalPages,
      prevPage: hasPrevPage ? +page - 1 : null,
      nextPage: hasNextPage ? +page + 1 : null,
      page: +page,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${+page - 1}` : null,
      nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${+page + 1}` : null,
    };

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productDao.getProductById(parseInt(pid, 10));

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addProduct = async (req, res) => {
  try {
    const newProduct = req.body;
    await productDao.addProduct(newProduct);
    return res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct
};