const Joi = require("joi");
const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
    products: {
         type:[new Schema({
            name: String,
             price: Number,
            quantity:Number,
            images: [String]
        })],
        required: true
    },
    totalQuantity: {
        type: Number,
        default:0
    },
    totalBill: {
        type: Number,
        default:0
}
});
const Cart = model("Cart", cartSchema);

function validate(cart) {
    const schema = Joi.object({
        productId: Joi.string().min(3).required(),
        quantity:Joi.number().integer().required()
    });
    return schema.validate(cart);
}
exports.Cart = Cart; 
exports.validate = validate;
