export const config = {
  runtime: "nodejs",
};
import { createCanvas, loadImage } from "canvas";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).send("POST only");

  try {
    const { facePng, hiRes = false } = req.body;

    if (!facePng || !facePng.startsWith("http")) {
      return res.status(400).json({ error: "Invalid facePng URL" });
    }

    const santaUrl =
      "https://cdn.shopify.com/s/files/1/0958/1255/1030/files/santa-ai.jpg?v=1766231836";

    const santaImg = await loadImage(santaUrl);
    const faceImg = await loadImage(facePng);

    const scale = hiRes ? 2 : 1;

    const canvas = createCanvas(
      santaImg.width * scale,
      santaImg.height * scale
    );
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      santaImg,
      0,
      0,
      santaImg.width * scale,
      santaImg.height * scale
    );

    const faceWidth = santaImg.width * 0.35 * scale;
    const faceHeight = (faceImg.height / faceImg.width) * faceWidth;

    const faceX = santaImg.width * 0.325 * scale;
    const faceY = santaImg.height * 0.18 * scale;

    ctx.drawImage(faceImg, faceX, faceY, faceWidth, faceHeight);

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
    console.error("COMPOSITE ERROR:", err);
    res.status(500).json({ error: "Compositing failed" });
  }
}
