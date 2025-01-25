const express = require('express');
const router = express.Router();
const { getSubSubCategories, getSubSubCategory, createSubSubCategory, updateSubSubCategory, deleteSubSubCategory } = require("../controllers/subsubcategory.controller")


router.get("/", getSubSubCategories)
router.get("/:id",getSubSubCategory)
router.post("/",createSubSubCategory)
router.put("/:id",updateSubSubCategory)
router.delete("/:id",deleteSubSubCategory)

module.exports = router;