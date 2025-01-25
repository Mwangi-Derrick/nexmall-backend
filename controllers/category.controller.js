const { Category, validate } = require("../models/category.model");
//CRUD opertaions for categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort("name");
    return res.status(200).send(categories);
  } 
  catch (error) {
    console.error(error)
  }
}
exports.createCategory = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const category = await new Category({ name: req.body.name }).save();
    return res.send(category);
  }
  catch (error) {
    console.error(error)
  }
}
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('subCategories');
    if (!category) { return res.status(404).send("The category with the given ID was not found.") };
    return res.send(category);
  } catch (error) {
    console.error(error)
  }
}
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) { return res.status(404).send("The category with the given ID was not found.") };
    return res.send(category);
  } catch (error) {
    console.error(error)
  }
}
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      {
        new: true,
      }
    );
    if (!category) {
      return res.status(404).send("The category with the given ID was not found.")
    };
    return res.send(category);
  }
  catch (error) {
    console.error(error)
  }
}
  
    

    
  