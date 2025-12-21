
import sharp from "sharp";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).send("POST only");

  try {
    const { facePng, hiRes = false } = req.body;
    console.log("FACE PNG RECEIVED:", facePng);
    if (!facePng) {
      return res.status(400).json({ error: "Missing facePng" });
    }

    const santaUrl =
      "https://cdn.shopify.com/s/files/1/0958/1255/1030/files/watermark.png?v=1766322420";

    const santaBuffer = await fetch(santaUrl).then(r => r.arrayBuffer());
    const faceBuffer = await fetch(facePng).then(r => r.arrayBuffer());

    const scale = hiRes ? 2 : 1;

    const santa = sharp(Buffer.from(santaBuffer));
    const santaMeta = await santa.metadata();

    const faceWidth = Math.floor(santaMeta.width * 0.35 * scale);
    const face = sharp(Buffer.from(faceBuffer)).resize(faceWidth);

const watermarkBuffer = await fetch(
  "https://cdn.shopify.com/s/files/1/0958/1255/1030/files/watermark.png?v=1766321505"
).then(r => r.arrayBuffer());

const output = await santa
  .composite([
    {
      input: await face.toBuffer(),
      left: Math.floor(santaMeta.width * 0.325 * scale),
      top: Math.floor(santaMeta.height * 0.18 * scale),
    },
    {
      input: Buffer.from(watermarkBuffer),
      gravity: "south",
    },
  ])
  .jpeg({ quality: hiRes ? 95 : 80 })
  .toBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.send(output);
  } catch (err) {
    console.error("COMPOSITE ERROR:", err);
    res.status(500).json({ error: "Composite failed" });
  }
}
