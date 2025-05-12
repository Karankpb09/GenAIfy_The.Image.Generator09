import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const router = express.Router();

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const STABILITY_API_URL = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

router.post("/generate-image", async (req, res) => {
    try {
        const prompt = req.body.prompt || "a fantasy landscape with mountains and a castle";

        if (!STABILITY_API_KEY) {
            return res.status(500).json({ error: "Stability API key not configured on the server." });
        }

        const response = await fetch(STABILITY_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "image/png",
                "Authorization": `Bearer ${STABILITY_API_KEY}`
            },
            body: JSON.stringify({
                text_prompts: [  // Changed to use text_prompts
                    { "text": prompt }
                ],
                width: 1024,
                height: 1024,
                samples: 1,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Stability AI API Error:", errorData);
            return res.status(response.status).json({
                error: `Image generation failed: ${errorData?.error || response.statusText}`,
            });
        }

        if (req.headers.accept === "application/json") {
            const responseData = await response.json();
            if (responseData && responseData.artifacts && responseData.artifacts.length > 0) {
                res.json({ image: responseData.artifacts[0].base64 });
            } else {
                return res.status(500).json({ error: "Image generation returned no artifacts." });
            }
        } else {
            const imageBuffer = await response.buffer();
            res.writeHead(200, {
                "Content-Type": "image/png",
                "Content-Length": imageBuffer.length,
            });
            res.end(imageBuffer);
        }
    } catch (err) {
        console.error("Error calling Stability AI API:", err);
        res.status(500).json({ error: "Image generation failed." });
    }
});

export default router;
