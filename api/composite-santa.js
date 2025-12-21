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
    const { facePng } = req.body;

    if (!facePng) {
      return res.status(400).json({ error: "Missing facePng" });
    }

    // HIP-HOP TEMPLATE (square, high-res)
    const templateUrl =
      "https://cdn.shopify.com/s/files/1/0958/1255/1030/files/hiphop-v1-template.png";

    const templateBuffer = await fetch(templateUrl).then(r => r.arrayBuffer());
    const faceBuffer = await fetch(facePng).then(r => r.arrayBuffer());

    const template = sharp(Buffer.from(templateBuffer));
    const templateMeta = await template.metadata();

    // FACE sizing (head & shoulders only)
    const faceWidth = Math.floor(templateMeta.width * 0.35);

    const face = sharp(Buffer.from(faceBuffer))
      .resize(faceWidth)
      .ensureAlpha();

    const output = await template
      .composite([
        {
          input: await face.toBuffer(),
          left: Math.floor(templateMeta.width * 0.325),
          top: Math.floor(templateMeta.height * 0.18),
        },
      ])
      .jpeg({ quality: 85 })
      .toBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.send(output);
  } catch (err) {
    console.error("COMPOSITE ERROR:", err);
    res.status(500).json({ error: "Composite failed" });
  }
}
