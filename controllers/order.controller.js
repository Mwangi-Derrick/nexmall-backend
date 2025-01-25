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

const getAccessToken = async () => {
  const consumerKey = "NexxbfupnSf3noMmzOxH1NLPt4B0PXy5E4oVY3VzP3GQ8Vn5";
  const consumerSecret = "uYnufirGWH4KAZXVQi9VIuwOZWPxGeNB0oHHY2eYzt67Q0h6cUnJqXmC0GCuge2L";
  const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  try {
    const encodedCredentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const headers = {
      Authorization: `Basic ${encodedCredentials}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(url, { headers });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw new Error("Failed to get access token.");
  }
};

exports.sendStkPush = async (req, res) => {
    try {
      const token = await getAccessToken();
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
  
      const requestBody = {
        BusinessShortCode: shortCode,
        Password: stkPassword,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: `254${phone}`,
        PartyB: shortCode,
        PhoneNumber: `254${phone}`,
        CallBackURL: "https://yourwebsite.co.ke/callbackurl",
        AccountReference: "account",
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
  