const {User, validate} = require('../models/user.model'); 
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

router.get('/me',auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
})
router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email })
    if (user) { return res.status(400).send("user is already registered") }
    
     user = new User({
        name: req.body.name,
        email: req.body.email,
        password:req.body.password
     });
    
     const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password,salt)
    await user.save();
  const token = await user.generateAuthToken();
  console.log(token)
  res.header('x-auth-token', token).send(user);
});
module.exports = router; 
  