const { Order } = require("../models/order.model");
const {Cart} = require("../models/cart.model")
exports.createOrder = async (req, res) => {
    try {
        const userId = req.user._id
        if(!userId){res.status(400).send("userId is required")}
        const { items, addressId, totalAmount, subtotalAmount } = req.body
        const products = items.map((item) => {
            return ({
                productId: item._id,
                quantity: item.quantity,
                price: item.price,
            })
        });
        let order = new Order({
            userId: userId,
            products: [products],
            addressId: addressId,
            transactionId: "",
            paymentStatus:"",
            totalAmount: totalAmount,
            subtotalAmount: subtotalAmount
        });
        order = await order.save();
       await Cart.deleteOne({ _id: userId });
        res.send(order)
    } catch (error) {
        console.error(error)
    }
}
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).send(orders)
  } catch (error) {
    console.error(error)
  }
}

exports.sendStkPush = async (req, res) => {
    try {
      const token = req.token;//accessToken middleware
      const date = new Date();
      const timestamp =
        date.getFullYear() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2);
  
      const shortCode = "174379"; // sandbox short code
      const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"; // sandbox passkey
      const stkPassword = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");
  
      const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
  
      // Validate and parse amount
      const amount = Math.round(Number(req.body.amount));
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).send({ error: "Invalid amount. Amount must be a positive number." });
      }
  
      // Validate phone number
      const phone = req.body.phone;
      if (!phone || !/^254\d{9}$/.test(`254${phone}`)) {
        return res.status(400).send({ error: "Invalid phone number." });
      }
      const userId = req.user._id.toString() // Get the user ID from the authenticated user
  
      const requestBody = {
        BusinessShortCode: shortCode,
        Password: stkPassword,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: `254${phone}`,
        PartyB: shortCode,
        PhoneNumber: `254${phone}`,
        CallBackURL: `https://2de8-102-0-11-108.ngrok-free.app/api/orders/callback?userId=${userId}`,
        AccountReference: userId,
        TransactionDesc: "test",
      };
  
      console.log("Request Payload:", requestBody);
  
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: headers,
      });
  
      const data = await response.json();
      res.status(200).send(data);
    } catch (error) {
      console.error("Error in sendStkPush:", error);
      res.status(500).send({ error: "Failed to process STK push request." });
    }
  };

  exports.handleMpesaCallback = async (req, res) => {
    try {
        console.log("Callback received:", req.body);

        const { Body } = req.body;
        if (!Body || !Body.stkCallback) {
            console.error("Invalid callback payload:", req.body);
            return res.status(400).send({ error: "Invalid callback payload." });
        }

        const resultCode = Body.stkCallback.ResultCode;
        const resultDesc = Body.stkCallback.ResultDesc;

        if (resultCode === 0) {
            console.log("Transaction successful:", Body.stkCallback);
            const transactionId = Body.stkCallback.CallbackMetadata.Item[1].Value
          console.log(transactionId)
          const userId = req.query.userId;
          if (!userId) {
            console.error("Missing userId in callback query.");
            return res.status(400).send({ error: "Missing userId in callback query." });
          }
          console.log(userId)
          // Save the successful transaction to the database or process accordingly
          const order = await Order.findByIdAndUpdate(userId, {
            transactionId: transactionId,
            paymentStatus:"completed"
          })
          if (!order) {
            console.error(`No order found for userId: ${userId}`);
            return res.status(404).send({ error: "Order not found for the given userId." });
          }
          
          await order.save();
        } else {
            console.log("Transaction failed:", resultDesc);
            // Handle failed transaction
        }

        // Acknowledge receipt of the callback
        res.status(200).send({ message: "Callback received successfully" });
    } catch (error) {
        console.error("Error in handleMpesaCallback:", error.message);
        res.status(500).send({ error: "Failed to handle callback." });
    }
};
