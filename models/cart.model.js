const Joi = require("joi");
const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
    customer: {
        type: new Schema({
            name: String,
             _id:String,
            phone: String,
        }),
        required: true
    },
    products: {
         type:[new Schema({
            name: String,
             price: Number,
            quantity:Number,
            images: [String]
        })],
        required: true
    },
    totalBill: {
        type: Number,
        default:0
}
});
const Cart = model("Cart", cartSchema);

function validate(cart) {
    const schema = Joi.object({
        customerId: Joi.string().min(3).required(),
        productId: Joi.string().min(3).required()
    });
    return schema.validate(cart);
}
exports.Cart = Cart; 
exports.validate = validate;
