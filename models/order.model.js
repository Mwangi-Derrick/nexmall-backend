const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
          },
          price: {
            type: Number,
            required: true,
          },
    }
    ],
    deliveryAddress: {
        type: Schema.Types.ObjectId,
        ref:'Address'
    },
    paymentStatus : {
        type : String,
        default : ""
    },
    totalAmount : {
        type : Number,
        default : 0
    },
    subTotalAmount: {
        type : Number,
        default : 0
    },
    transactionId: {
        type: String,
        default:""
    }
    
});

const Order = model('Order', orderSchema);
exports.Order = Order;