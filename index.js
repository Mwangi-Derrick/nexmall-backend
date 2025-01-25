require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const categories = require('./routes/categories');
const subcategories = require('./routes/subcategories');
const subsubcategories = require('./routes/subsubcategories');
const products = require('./routes/products');
const carts = require('./routes/carts');
const customers = require('./routes/customers');
const users = require('./routes/users');
const auth = require('./routes/auth');
const imageUpload = require('./routes/imageUpload');
const imageDelete = require('./routes/imageDelete');
const order = require('./routes/orders');
const address = require('./routes/address');
mongoose.connect(process.env.MONGO_URL).then(() => console.log('connected to mongodb'))
    .catch(e=>{console.error(e)});

    if (!process.env.JWT_PRIVATE_KEY) {
        console.error("FATAL ERROR: jwtPrivateKey is not defined")
        process.exit(1)
    }
const app = express();
app.use(cors())
app.use(express.json());
app.use('/api/categories', categories)
app.use('/api/products', products)
app.use('/api/carts', carts)
app.use('/api/customers', customers)
app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/uploadImage', imageUpload)
app.use('/api/deleteImage', imageDelete);
app.use('/api/subcategories',subcategories);
app.use('/api/subsubcategories', subsubcategories);
app.use('/api/orders', order);
app.use('/api/address', address);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));