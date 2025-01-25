const { Schema, model } = require('mongoose');
const {categorySchema} = require('./category.model');
const Joi = require("joi");
const { subCategorySchema }  = require('./subCategory.model');
const { subSubCategorySchema }  = require('./subSubCategory.model');
const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true,
        min:0
    },
    salesPrice: {
        type: Number,
        required: true,
        min:0
    },
    description: {
        type: String,
        required: true
    },
    numberInStock:{
        type: Number,
        required: true
    },
    category: {
        type: categorySchema,
        required:true
    },
    subcategory: {
        type:subCategorySchema,
        required:true
   },
    subsubcategory: {
        type:subSubCategorySchema,
        required:true
    },
    image: {
        type : Array,
        default : []
    },
});

const Product = model('Product', productSchema);
function validateProduct(product) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(255).required(),
        type:Joi.string().required(),
        price: Joi.number().required(), // Price is a required number
        salesPrice:Joi.number().required(),
  description: Joi.string().required(), // Description is a required string
  numberInStock: Joi.number().required(), // NumberInStock is a required number
  category: Joi.object({
      name: Joi.string().required(), // Name is a required string
    _id:Joi.string().required() 
  }),
  subcategory:Joi.object({
      name: Joi.string().required(), // Name is a required string
      imageUrl:Joi.string().required(),
  _id:Joi.string().required() 
  }),
  subsubcategory:Joi.object({
    name: Joi.string().required(), // Name is a required string
    imageUrl:Joi.string().required(),
_id:Joi.string().required() 
}),
        categoryName: Joi.string().required(),
        subCategoryName: Joi.string().required(),
      subSubCategoryName:Joi.string().required(),
        image:Joi.array().items(Joi.string()).required()
    })
    
    return schema.validate(product);
}
exports.Product = Product
exports.validate = validateProduct


