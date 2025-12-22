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

    // === TEMPLATE (Hip-Hop v1) ===
    const templateUrl =
      "https://cdn.shopify.com/s/files/1/0958/1255/1030/files/santa.jpg?v=1766418888";

    // === WATERMARK ===
    const watermarkUrl =
      "https://cdn.shopify.com/s/files/1/0958/1255/1030/files/watermark2.png";

    const templateBuffer = await fetch(templateUrl).then(r => r.arrayBuffer());
    const faceBuffer = await fetch(facePng).then(r => r.arrayBuffer());
    const watermarkBuffer = await fetch(watermarkUrl).then(r => r.arrayBuffer());

const templateMeta = await sharp(Buffer.from(templateBuffer)).metadata();

    const scale = hiRes ? 2 : 1;

    // === FACE PREP ===
    const faceWidth = Math.floor(templateMeta.width * 0.35 * scale);
const face = sharp(Buffer.from(faceBuffer))
  .resize(faceWidth)
  .ensureAlpha()
  .blur(0.8)
  .composite([
    {
      input: Buffer.from(
        `<svg width="${faceWidth}" height="${faceWidth}">
          <defs>
            <radialGradient id="fade" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stop-color="white"/>
              <stop offset="100%" stop-color="black"/>
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#fade)"/>
        </svg>`
      ),
      blend: "dest-in"
    }
  ]);

    // === COMPOSITE ===
const output = await sharp(Buffer.from(templateBuffer))
  .composite([
        {
          input: await face.toBuffer(),
          left: Math.floor(templateMeta.width * 0.325 * scale),
          top: Math.floor(templateMeta.height * 0.18 * scale),
        },
{
  input: await sharp(Buffer.from(watermarkBuffer))
    .resize(Math.floor(templateMeta.width * 0.8))
    .png()
    .toBuffer(),
  gravity: "south",
},
      ])
      .jpeg({ quality: hiRes ? 95 : 80 })
      .toBuffer();

res.setHeader("Content-Type", "image/jpeg");
res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
res.setHeader("Pragma", "no-cache");
res.setHeader("Expires", "0");
res.setHeader("Surrogate-Control", "no-store");
res.send(output);
  } catch (err) {
    console.error("COMPOSITE ERROR:", err);
    res.status(500).json({ error: "Composite failed" });
  }
}
