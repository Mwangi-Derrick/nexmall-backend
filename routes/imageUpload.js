const express = require("express");
const auth = require("../middleware/auth");
const uploadImageController = require("../controllers/uploadImage.controller");
const upload = require("../middleware/multer")
const router = express.Router();

router.post("/",upload.single("image"), uploadImageController);

module.exports = router;