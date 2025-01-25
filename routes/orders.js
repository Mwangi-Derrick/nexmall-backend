const { createOrder, sendStkPush } = require("../controllers/order.controller");
const express = require("express");
const router = express.Router();

router.post("/", createOrder);
router.post("/pay", sendStkPush);

module.exports = router