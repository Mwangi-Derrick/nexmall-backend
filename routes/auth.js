
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');

const { Schema, model } = require('mongoose');
;
const { User } = require('../models/user');


router.post('/', async (req, res) => {
    const { error } = validateUser(req.body); 
    if (error) { return res.status(400).send(error.details[0].message) };
    let user = await User.findOne({ email: req.body.email })
    if (!user) { return res.status(400).send("Invalid email or password") }
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
        return res.status(400).send("Invalid email or password")
    }
    const token = await user.generateAuthToken();
   return res.send(token);
});

function validateUser(req) {
    const schema = Joi.object({
        email: Joi.string().min(3).required().email(),
        password:Joi.string().min(3).required()
    });
    return schema.validate(req);
}
module.exports = router; 
  