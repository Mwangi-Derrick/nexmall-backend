const { Subcategory } = require('../models/subCategory.model');
const {Subsubcategory}  = require('../models/subSubCategory.model');


//CRUD operations for subSubCategories
exports.getSubSubCategories = async (req, res) => {
    try {
        const subsubcategories = await Subsubcategory.find().populate('parentSubcategory');
        res.json(subsubcategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  exports.createSubSubCategory = async (req, res) => {
    const { name, imageUrl, parentSubcategoryId } = req.body;
  
    const subcategory = await Subcategory.findById(parentSubcategoryId);
    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }
  
    const subsubcategory = new Subsubcategory({
      name,
      imageUrl,
    parentSubcategory: parentSubcategoryId
    });
  
    try {
      await subsubcategory.save();
      subcategory.subSubCategories.push(subsubcategory._id);
      await subcategory.save();
      res.status(201).json(subsubcategory);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
    exports.getSubSubCategory =  async (req, res) => {
        try {
          const subsubcategory = await Subsubcategory.findById(req.params.id).populate('parentSubcategory');
          res.json(subsubcategory);
        } catch (error) {
          res.status(404).json({ error: 'Sub-subcategory not found' });
        }
      }
exports.updateSubSubCategory = async (req, res) => {
   
  try {
    const { name,imageUrl,parentSubCategoryId } = req.body;
  const { id } = req.params
  const subsubcategory = await Subsubcategory.findById(id);
  if (!subsubcategory) { return res.status(404).json({ error: "subsubcategory not found" }) };
  if (subsubcategory.parentSubcategory.toString() !== parentSubCategoryId) {
    await Subcategory.updateOne({ _id: subsubcategory.parentSubcategory }, { $pull: { subSubCategories: id } });
    await Subcategory.updateOne({ _id: parentSubCategoryId }, { $addToSet: { subSubCategories: id } })
    subsubcategory.parentSubcategory = parentSubCategoryId;
  }
  subsubcategory.name = name || subsubcategory.name;
  subsubcategory.imageUrl = imageUrl || subsubcategory.imageUrl;
 await subsubcategory.save()  
  res.status(200).json(subsubcategory);
} catch (err) {
  res.status(400).json({ error: err.message });
}
};
exports.deleteSubSubCategory =  async (req, res) => {
    try {
      await Subsubcategory.findByIdAndDelete(req.params.id);
      await Subcategory.updateOne({_id:Subsubcategory.parentSubcategory},{$pull:{subSubCategories:req.params.id}})
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }