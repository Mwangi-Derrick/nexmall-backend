const express = require('express');
const router = express.Router();
const {getProducts,createProduct,updateProduct,findProduct,deleteProduct,getProductImages,searchProductsByCategories}=require("../controllers/product.controller")

router.get('/', getProducts);
router.post('/',createProduct );
router.put('/:id',updateProduct);
router.get('/:id',findProduct);
router.delete('/:id',deleteProduct );
router.get('/:id/images', getProductImages);
router.post('/category',searchProductsByCategories)

module.exports = router