const mongoose = require('mongoose');
const express = require('express');
const config = require('config');
const categories = require('./routes/categories');
const products = require('./routes/products');
const carts = require('./routes/carts');
const customers = require('./routes/customers');
const users = require('./routes/users');
const auth = require('./routes/auth');

mongoose.connect('mongodb://localhost/nexmall').then(() => console.log('connected to mongodb'))
    .catch(e=>{console.error(e)});

    if (!config.get("jwtPrivateKey")) {
        console.error("FATAL ERROR: jwtPrivateKey is not defined")
        process.exit(1)
    }
const app = express();
app.use(express.json());
app.use('/api/categories', categories)
app.use('/api/products', products)
app.use('/api/carts', carts)
app.use('/api/customers', customers)
app.use('/api/users', users)
app.use('/api/auth',auth)
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));