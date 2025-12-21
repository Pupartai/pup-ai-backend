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
    if (!facePng) {
      return res.status(400).json({ error: "Missing facePng" });
    }

    // ✅ Hip-Hop template (no dog face)
    const templateUrl =
      "https://cdn.shopify.com/s/files/1/0958/1255/1030/files/hiphop-v1-template.png";

    const templateBuffer = await fetch(templateUrl).then(r => r.arrayBuffer());
    const faceBuffer = await fetch(facePng).then(r => r.arrayBuffer());

    const template = sharp(Buffer.from(templateBuffer));
    const templateMeta = await template.metadata();

    // ✅ Resize incoming dog face
    const faceWidth = Math.floor(templateMeta.width * 0.35);
    const face = sharp(Buffer.from(faceBuffer)).resize(faceWidth);

    // ✅ Watermark (WORKING VERSION)
    const watermarkBuffer = await fetch(
      "https://cdn.shopify.com/s/files/1/0958/1255/1030/files/watermark2.png"
    ).then(r => r.arrayBuffer());

    const output = await template
      .composite([
        {
          input: await face.toBuffer(),
          left: Math.floor(templateMeta.width * 0.325),
          top: Math.floor(templateMeta.height * 0.18),
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
