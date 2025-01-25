const {Subcategory } = require("../models/subCategory.model");
const { Category } = require("../models/category.model")

//CRUD operations for subcategories
exports.getSubCategories = async (req, res) => {
    try {
      const subcategories = await Subcategory.find().populate('parentCategory');;
      if (!subcategories) return res.status(404).json({ error: 'subcategory not found' });
  
      res.status(200).json(subcategories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}
exports.getSubCatgeoriesBasedOnParentCategory = async (req, res) => {
  try {
    const { id } = req.query
    if(!id){return res.status(400).json({error:'parent category id is required'})}
      const subcategories = await Subcategory.find({ parentCategory: id }).populate('subSubCategories')
    if (!subcategories) return res.status(404).json({ error: 'subcategories not found' });

      res.status(200).json(subcategories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  exports.createSubCategory =  async (req, res) => {
    const { name, imageUrl, parentCategoryId } = req.body;

  const category = await Category.findById(parentCategoryId);
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  const subcategory = new Subcategory({
    name,
    imageUrl,
    parentCategory: parentCategoryId
  });

  try {
    await subcategory.save();
    category.subCategories.push(subcategory._id);
    await category.save();
    res.status(201).json(subcategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  }
    exports.getSubCategory = async (req, res) => {
        try {
            const subcategory = await Subcategory.findById(req.params.id).populate('parentCategory').populate('subSubCategories');
            res.json(subcategory);
          } catch (error) {
            res.status(404).json({ error: 'Subcategory not found' });
          }
        }
    exports.updateSubCategory = async (req, res) => {
      
        try {
            const { name,imageUrl,parentCategoryId } = req.body;
          const { id } = req.params
          const subcategory = await Subcategory.findById(id);
          if (!subcategory) { return res.status(404).json({ error: "subcategory not found" }) };
          if (subcategory.parentCategory.toString() !== parentCategoryId) {
            await Category.updateOne({ _id: subcategory.parentCategory }, { $pull: { subCategories: id } });
            await Category.updateOne({ _id: parentCategoryId }, { $addToSet: { subCategories: id } })
            subcategory.parentCategory = parentCategoryId;
          }
          subcategory.name = name || subcategory.name;
          subcategory.imageUrl = imageUrl || subcategory.imageUrl;
         await subcategory.save()  
          res.status(200).json(subcategory);
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
      }
exports.deleteSubCategory = async (req, res) => {
    try {
     const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
      if(!subcategory){return res.status(404).json({ error: 'Subcategory not found' });
      }
      await Category.updateOne({_id:subcategory.parentCategory},{$pull:{subCategories:req.params.id}})
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }