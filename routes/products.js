const express = require('express');
const router = express.Router();
const { Product, validate } = require("../models/product");
const { Category } = require("../models/category");
const cloudinary = require("../utils/cloudinary");
const upload = require("../middleware/multer");


router.get('/',async (req,res) => {
    const products = await Product.find().sort('name')
    res.send(products);
});

router.post('/', async (req,res) => { 
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const category = await Category.findById(req.body.category._id);
    let product = new Product({
        name: req.body.name,
        price:req.body.price,
        type:req.body.type,
        description: req.body.description,
        numberInStock:req.body.numberInStock,
        category: {
            name: category.name,
            _id:category._id
        }
    });
    product = await product.save();
    res.send(product);
});

router.get('/:id',async (req,res) => {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send('The product with the given ID was not found.');
  
    res.send(product);
});

router.delete('/:id', async(req,res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) return res.status(404).send('The product with the given ID was not found.');
  
    res.send(product);
});
router.get('/:id/images', async (req, res) => {
    const product = await Product.findById(req.params.id)
    const images = product.images
    res.send(images)
});


// Express route for image upload
router.post('/:id/upload', upload.single('image'), async (req, res) => {
    try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'folder_name'
        });
       
        async function addUrl(productId, url) {
            try {
                const product = await Product.findById(productId)
                product.images.push(url);
                await product.save()
                res.send(product)
            
            } catch (error) {
                console.log(error)
            }
        } addUrl(req.params.id, result.secure_url)

        // Send the Cloudinary URL in the response
        res.json({ imageUrl: result.secure_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading image to Cloudinary' });
    }
});
 
module.exports = router