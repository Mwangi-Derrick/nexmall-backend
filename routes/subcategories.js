const express = require('express');
const router = express.Router();
const { getSubCategories,getSubCatgeoriesBasedOnParentCategory, getSubCategory, createSubCategory, updateSubCategory, deleteSubCategory } = require("../controllers/subcategory.controller")


router.get("/", getSubCategories);
router.get("/parentCategory",getSubCatgeoriesBasedOnParentCategory)
router.get("/:id", getSubCategory);
router.post("/", createSubCategory);
router.put("/:id", updateSubCategory);
router.delete("/:id", deleteSubCategory);

module.exports = router;
