exports.getAccessToken = async (req,res,next) => {
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
        req.token = data.access_token;
        next();
    } catch (error) {
      console.error("Error getting access token:", error);
      throw new Error("Failed to get access token.");
    }
  };
  