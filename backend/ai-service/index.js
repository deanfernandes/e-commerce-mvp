require("dotenv").config();
const express = require("express");
const OpenAI = require("openai");
const authenticateJwt = require("./middleware/authenticateJwt");
const authorizeRole = require("./middleware/authorizeRole");

const client = new OpenAI();

const app = express();

app.use(express.json());

app.get("/ai/health", async (req, res) => {
  console.log("health check");
  res.json({ status: "ok", timestamp: Date.now() });
});

app.post(
  "/ai/generate-description",
  authenticateJwt,
  authorizeRole("user", "admin"),
  async (req, res) => {
    try {
      const { title } = req.body;
      if (!title)
        return res.status(400).json({ success: false, error: "Missing title" });

      const prompt = `
      Write a very short e-commerce product description for this product:
      Title: ${title}
      Keep it under 30 tokens and make it appealing.
      `;

      const response = await client.responses.create({
        model: "gpt-4o-mini",
        input: prompt,
        max_output_tokens: 30,
      });

      res.json({ success: true, message: response.output_text });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
