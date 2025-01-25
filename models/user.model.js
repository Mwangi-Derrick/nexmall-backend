const Joi = require("joi");
const { Schema, model } = require("mongoose");
const jwt = require('jsonwebtoken');


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required:true,
        unique: true,
        lowercase: true,
        trim:true,
    },
    password: {
        type: String,
        required:true
    },
    isAdmin:Boolean
});
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
        _id: this._id, name: this.name, email: this.email,
        isAdmin: this.isAdmin
    }, process.env.JWT_PRIVATE_KEY);
    return token;
}
const User = model('User', userSchema);


function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(3).required().email(),
        password:Joi.string().min(3).required()
    });
    return schema.validate(user);
}
exports.User = User;
exports.validate = validateUser