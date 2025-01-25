const express = require("express");
const router = express.Router();
const { createAddress, getAddress, updateAddress, deleteAddress } = require("../controllers/address.controller");

router.post('/', createAddress);
router.get('/:id', getAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

module.exports = router;