// api/composite-santa.js
import { createCanvas, loadImage } from "canvas";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("POST only");
  }

  try {
    const { facePng, hiRes = false } = req.body;
    if (!facePng) {
      return res.status(400).json({ error: "Missing facePng" });
    }

    // Santa base
    const santaUrl =
      "https://cdn.shopify.com/s/files/1/0958/1255/1030/files/santa-ai.jpg?v=1766231836";

    const santaImg = await loadImage(santaUrl);
    const faceImg = await loadImage(facePng);

    // Scale: low-res = 1x, hi-res = 2x
    const scale = hiRes ? 2 : 1;

    const canvas = createCanvas(
      santaImg.width * scale,
      santaImg.height * scale
    );
    const ctx = canvas.getContext("2d");

    // Draw Santa
    ctx.drawImage(
      santaImg,
      0,
      0,
      santaImg.width * scale,
      santaImg.height * scale
    );

    // ---- FACE PLACEMENT (tweak later) ----
    const faceWidth = santaImg.width * 0.35 * scale;
    const faceHeight =
      (faceImg.height / faceImg.width) * faceWidth;

    const faceX = santaImg.width * 0.325 * scale;
    const faceY = santaImg.height * 0.18 * scale;

    ctx.drawImage(faceImg, faceX, faceY, faceWidth, faceHeight);

    // ---- WATERMARK (LOW RES ONLY) ----
    if (!hiRes) {
      ctx.font = `${36 * scale}px Arial`;
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.textAlign = "center";
      ctx.fillText(
        "FREE Christmas Dog Portrait @pupartai",
        canvas.width / 2,
        canvas.height - 30 * scale
      );
    }

    const output = canvas.toBuffer("image/jpeg", {
      quality: hiRes ? 0.95 : 0.8,
    });

    res.setHeader("Content-Type", "image/jpeg");
    res.send(output);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Compositing failed" });
  }
}
