const express = require("express");
const router = express.Router();
const { Category, validate } = require("../models/category");


router.get("/", async (req, res) => {
  const categories = await Category.find().sort("name");
 return res.send(categories);
});
 
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const category = await new Category({ name: req.body.name }).save();
  return res.send(category);
});

router.put("/:id", async (req, res) => {
  const category = await new Category.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );
  if (!category)
    {return res.status(404).send("The category with the given ID was not found.")
};
 return res.send(category);
});

router.delete("/:id",async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) { return res.status(404).send("The category with the given ID was not found.") };
return  res.send(category);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) { return res.status(404).send("The category with the given ID was not found.") };
  return res.send(category);
});
module.exports = router;
