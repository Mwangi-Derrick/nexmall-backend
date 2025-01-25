const express = require("express");
const router = express.Router();
const deleteImageController = require("../controllers/deleteImage.controller");

router.delete("/", deleteImageController)
module.exports = router;