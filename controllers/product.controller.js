
const { Product, validate } = require("../models/product.model");
const { Category } = require("../models/category.model");
const { Subcategory } = require("../models/subCategory.model");
const { Subsubcategory } = require("../models/subSubCategory.model");
const mongoose = require('mongoose');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort('name')
        res.send(products);
    } catch (error) {
        console.error(error)
    }
   
}
exports.createProduct = async (req, res) => {
        try {
            const { error } = validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            const {categoryName,subCategoryName,subSubCategoryName} = req.body
            const category = await Category.findOne({ name: categoryName });
            const subcategory = await Subcategory.findOne({ name: subCategoryName });
            const subsubCategory = await Subsubcategory.findOne({name:subSubCategoryName})
            let product = new Product({
                image:req.body.image,
                name: req.body.name,
                price: req.body.price,
                salesPrice:req.body.salesPrice,
                type:req.body.type,
                description: req.body.description,
                numberInStock: req.body.numberInStock,
                category: {
                    name: category.name,
                    _id:category._id
                },
                subcategory: {
                    name: subcategory.name,
                    imageUrl:subcategory.imageUrl,
                    _id:subcategory._id
                },
                subsubcategory: {
                    name: subsubCategory.name,
                    imageUrl:subsubCategory.imageUrl,
                    _id:subsubCategory._id
                }
            });
            product = await product.save();
            res.send(product);     
        } catch (error) {
            console.error(error)
        }
       
    }
exports.updateProduct = async (req, res) => {
        try {
            const { error } = validate(req.body);
            if (error) return res.status(400).send(error.details[0].message);
            const {categoryName,subCategoryName,subSubCategoryName} = req.body
            const category = await Category.findOne({ name: categoryName });
            const subcategory = await Subcategory.findOne({ name: subCategoryName });
            const subsubCategory = await Subsubcategory.findOne({name:subSubCategoryName})
            const update = {
                $set: {
                    image:req.body.image,
                    name: req.body.name,
                    price: req.body.price,
                    salesPrice:req.body.salesPrice,
                    type:req.body.type,
                    description: req.body.description,
                    numberInStock:req.body.numberInStock,
                    category: {
                        name: category.name,
                        _id:category._id
                    },
                    subcategory: {
                        name: subcategory.name,
                        imageUrl:subcategory.imageUrl,
                        _id:subcategory._id
                    },
                    subsubcategory: {
                        name: subsubCategory.name,
                        imageUrl:subsubCategory.imageUrl,
                        _id:subsubCategory._id
                    }
                }
            }
            let product = await Product.findByIdAndUpdate(req.params.id, update);
            product = await product.save();
            res.send(product);    
        } catch (error) {
            console.error(error)
        }
        
    }
    exports.findProduct = async (req, res) => {
        try {
                const product = await Product.findById(req.params.id);
            if (!product) return res.status(404).send('The product with the given ID was not found.');
          
            res.send(product);
            } catch (error) {
                console.error(error)
            }
            
        }
exports.deleteProduct = async (req, res) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
    
            if (!product) return res.status(404).send('The product with the given ID was not found.');
          
            res.send(product);
        } catch (error) {
            console.error(error)
        }
      
}
exports.getProductImages = async (req, res) => {
        try {
            const product = await Product.findById(req.params.id)
            const images = product.image
            res.send(images)
        } catch (error) {
           console.error(error) 
        }
       
    }


    exports.searchProductsByCategories =async (req, res) => {
        try {
            const { id } = req.query; // Get the ID from the query parameter
    
            if (!id) { return res.status(400).send('ID query parameter is required'); }

            // Search for products by category, subcategory, or subsubcategory ID
            const products = await Product.find({
                $or: [
                    { 'category._id':new mongoose.Types.ObjectId(id) },
                    { 'subcategory._id':new mongoose.Types.ObjectId(id) },
                    { 'subsubcategory._id':new mongoose.Types.ObjectId(id) }
                ]
            });
    
            if (products.length === 0) {
                return res.status(404).send('No products found');
            }
    
            return res.status(200).json(products);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Server error');
        }
    };
    