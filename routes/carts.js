const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {getAllCarts,addToCart,getCart,decrementQuantity,removeAllFromCart}  = require('../controllers/cart.controller')
router.get('/',auth, getAllCarts);
router.post('/', auth,addToCart)
router.get('/:id',auth,getCart);
router.put('/:id',auth, decrementQuantity);
router.delete("/:id",auth, removeAllFromCart);

module.exports = router;
