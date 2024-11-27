const { Cart, validate } = require('../models/cart.model');
const { Product } = require('../models/product.model');
const { Customer } = require('../models/customer.model');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET all carts
router.get('/', async (req, res) => {
  const carts = await Cart.find();
  res.send(carts);
});

// POST a new cart or update an existing cart
router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const product = await Product.findById(req.body.productId);
  if (!product) return res.status(400).send('Invalid product.');

  if (product.numberInStock === 0) return res.status(400).send('Product not in stock.');

  // Find the cart for the logged-in user
  let cart = await Cart.findById(req.user._id);

  if (!cart) {
    // Create a new cart if it doesn't exist
    cart = new Cart({
      _id: req.user._id,
      customer: {
        _id: customer._id,
        name: customer.name,
          phone: customer.phone,
          totalBill: cart?.products?.reduce((acc, current) => {
              return  acc+=current.quantity*current.price
          })
      },
      products: [{
        name: product.name,
        price: product.price,
        _id: product._id,
        quantity:  1,  
        images: product.images
      }]
    });
  } else {
    
    // Check if a product is already in the cart
    let productInCart = cart.products.find(item => item._id === product._id);
     
    if (productInCart) {
      // Checks if the product is in the cart,if it is increase its quantity
        productInCart.quantity += 1;
         //update bill of the cart
      cart["totalBill"] = cart.products.reduce((acc, current) => {
        return acc+= current.price * current["quantity"]
    },0)
    } else {
        // Adds a new product if its not found in the cart
      cart.products.push({
        name: product.name,
        price: product.price,
        _id: product._id,
        quantity: 1, 
        images: product.images
      });
    }
  }

  // Save the cart and decrease product stock
  await cart.save();
  product.numberInStock--;
  await product.save();

  res.send(cart);
});

// GET a specific cart by ID
router.get('/:id', async (req, res) => {
  const cart = await Cart.findById(req.params.id);

  if (!cart) return res.status(404).send('The cart with the given ID was not found.');

  res.send(cart);
});

router.put('/:id', async (req, res) => {
  try {
    // Find the cart by ID
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).send('The cart with the given ID was not found.');

    // Check if the product exists in the cart
    const productInCart = cart.products.find(item => item._id === req.body.productId);
    if (!productInCart) return res.status(404).send('The product is not in the cart.');

    // Find the product in the database by its id
    const product = await Product.findById(req.body.productId);
    if (!product) return res.status(404).send('The product does not exist.');

    // Update product quantity and cart total based on conditions
    if (productInCart.quantity > 1) {
      // Decrement the quantity
      productInCart.quantity -= 1;
      cart.totalBill -= productInCart.price;

      // Increase product stock
      product.numberInStock += 1;
    } else if (productInCart.quantity === 1) {
      // Remove the product from the cart
      cart.products = cart.products.filter(item => item._id !== req.body.productId);
      cart.totalBill -= productInCart.price;

      // Increase product stock
      product.numberInStock += 1;
    }

    // Save the updated cart and product
    await cart.save();
    await product.save();

    // Send the updated cart
    if (cart.products.length === 0) return res.send('The cart is now empty.');
    res.send(cart);
  } catch (error) {
    res.status(500).send('Something went wrong.');
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).send('The cart with the given ID was not found.');
    const product = await Product.findById(req.body.productId);
    if (!product) return res.status(404).send('The product does not exist.');
    const productInCart = cart.products.find(item => item._id === req.body.productId);
    cart.products.pull({ _id: productInCart._id });
    cart.totalBill -= productInCart.quantity * productInCart.price;
    product.numberInStock += productInCart.quantity;
    await cart.save();
    await product.save();
    res.send(cart);
  } catch (e)
  { console.error(e) }
});

module.exports = router;
