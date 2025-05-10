import express from "express";
import Replicate from "replicate";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

router.post("/generate-image", async (req, res) => {
  try {
    const prompt = req.body.prompt || "a fantasy landscape with mountains and a castle";

    const output = await replicate.run(
      "stability-ai/sdxl:ca1a209aa929b65c4fa69c9d81f8c3c0bc2e8c7e2ed27009fda6b61e3016bfa0", // Official SDXL version
      {
        input: {
          prompt: prompt,
        },
      }
    );

    if (!output || !Array.isArray(output) || output.length === 0) {
      return res.status(500).json({ error: "Image generation returned no output." });
    }

    res.json({ image: output[0] });

  } catch (err) {
    console.error("Replicate API Error:", err?.response?.data || err.message || err);
    res.status(500).json({ error: "Image generation failed." });
  }
});

export default router;
