const mongoose = require('mongoose');
const subSubCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true
    },
    parentSubcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory'
    }
});

const Subsubcategory = mongoose.model('Subsubcategory', subSubCategorySchema);
module.exports = {Subsubcategory,subSubCategorySchema}