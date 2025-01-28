const { createOrder,handleMpesaCallback, sendStkPush } = require("../controllers/order.controller");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getAccessToken } = require("../middleware/accessToken");

router.post("/",auth, createOrder);
router.post("/pay", auth,getAccessToken, sendStkPush);
router.post("/callback", handleMpesaCallback);

module.exports = router