const { Cart, validate } = require("../models/cart.model");
const { Product } = require("../models/product.model");

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(400).send("The cart with the given ID was not found.");
    res.send(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong.");
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const product = await Product.findById(req.body.productId);
    if (!product) return res.status(400).send("Invalid product.");
    if (product.numberInStock === 0) return res.status(400).send("Product not in stock.");

    // Convert quantity to a number
    const quantity = parseInt(req.body.quantity,10);
    if (isNaN(quantity) || quantity <= 0)
      return res.status(400).send("Quantity must be a valid positive number.");

    let cart = await Cart.findById(req.user._id);
    if (!cart) {
      cart = new Cart({
        _id: req.user._id,
        totalQuantity: 1,
        totalBill: product.price * quantity,
        products: [
          {
            name: product.name,
            price: product.salesPrice,
            _id: product._id,
            quantity,
            images: product.image,
          },
        ],
      });
    } else {
      const productInCart = cart.products.find((item) => item._id.toString() === product._id.toString());
      if (productInCart) {
        // Add the new quantity to the existing quantity
        productInCart.quantity += quantity;
      } else {
        cart.products.push({
          name: product.name,
          price: product.salesPrice,
          _id: product._id,
          quantity,
          images: product.image,
        });
        cart.totalQuantity += 1;
      }
    }

    cart.totalBill = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await cart.save();

    product.numberInStock -= quantity;
    await product.save();

    res.send(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong.");
  }
};

exports.decrementQuantity = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).send("The cart with the given ID was not found.");

    const productInCart = cart.products.find((item) => item._id.toString() === req.body.productId.toString());
    if (!productInCart) return res.status(404).send("The product is not in the cart.");

    const product = await Product.findById(req.body.productId);
    if (!product) return res.status(404).send("The product does not exist.");

    if (productInCart.quantity > 1) {
      productInCart.quantity -= 1;
      cart.totalBill -= productInCart.price;
    } else {
      cart.products = cart.products.filter((item) => item._id.toString() !== req.body.productId.toString());
      cart.totalBill -= productInCart.price;
      cart.totalQuantity -= 1;
    }

    product.numberInStock += 1;
    await cart.save();
    await product.save();

    res.send(cart.products.length > 0 ? cart : "The cart is now empty.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong.");
  }
};

exports.removeAllFromCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).send("The cart with the given ID was not found.");

    const productInCart = cart.products.find((item) => item._id.toString() === req.body.productId.toString());
    if (!productInCart) return res.status(404).send("The product is not in the cart.");

    const product = await Product.findById(req.body.productId);
    if (!product) return res.status(404).send("The product does not exist.");

    cart.products = cart.products.filter((item) => item._id.toString() !== req.body.productId.toString());
    cart.totalBill -= productInCart.price * productInCart.quantity;
    cart.totalQuantity -= 1;

    product.numberInStock += productInCart.quantity;

    await cart.save();
    await product.save();

    res.send(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong.");
  }
};

exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find();
    res.send(carts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong.");
  }
};
