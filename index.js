// index.js
const express = require("express");
const axios = require("axios");
require("dotenv\config");

const app = express();
app.use(express.json());

app.post("/ghl-webhook", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Send to Weaviate
    const response = await axios.post(
      `${process.env.WEAVIATE_URL}/v1/objects`,
      {
        class: "GHLMessages",
        properties: { name, email, message }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WEAVIATE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Weaviate Response:", response.data);
    res.status(200).send("Data sent to Weaviate successfully");
  } catch (error) {
    console.error("Error sending to Weaviate:", error.response?.data || error.message);
    res.status(500).send("Failed to send data to Weaviate");
  }
});

app.get("/", (req, res) => {
  res.send("GHL Webhook Receiver is running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
