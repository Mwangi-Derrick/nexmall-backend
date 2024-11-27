const Joi = require('joi');
const { Schema, model } = require('mongoose');
const customerSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
   
});
const Customer = model('Customer', customerSchema);
function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(3).required(),
    });
    return schema.validate(customer);
}
exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
