const { createOrder, sendStkPush } = require("../controllers/order.controller");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.post("/",auth, createOrder);
router.post("/pay",auth, sendStkPush);

module.exports = router