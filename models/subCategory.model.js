const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required:true
    },
    parentCategory: {
         type: mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    subSubCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Subsubcategory'
}]
});
const Subcategory = mongoose.model('Subcategory', subCategorySchema);
module.exports = {Subcategory, subCategorySchema}
