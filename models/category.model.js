const Joi = require('joi');
const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    subCategories:  [{
        type: Schema.Types.ObjectId,
        ref: 'Subcategory'
      }]
    
});

const Category = model('Category', categorySchema);
function validateCategory(category) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required()
    })
    return schema.validate(category);
}
exports.categorySchema = categorySchema;
exports.Category = Category;
exports.validate = validateCategory;
