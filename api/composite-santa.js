import sharp from "sharp";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).send("POST only");

  const { facePng, hiRes = false } = req.body;
  if (!facePng) return res.status(400).json({ error: "Missing facePng" });

  try {
    const santaUrl =
      "https://cdn.shopify.com/s/files/1/0958/1255/1030/files/santa-ai.jpg?v=1766231836";

    const santaBuffer = await fetch(santaUrl).then(r => r.arrayBuffer());
    const faceBuffer = await fetch(facePng).then(r => r.arrayBuffer());

    const scale = hiRes ? 2 : 1;

    const santa = sharp(Buffer.from(santaBuffer));
    const santaMeta = await santa.metadata();

    const faceWidth = Math.round(santaMeta.width * 0.35 * scale);

    const face = await sharp(Buffer.from(faceBuffer))
      .resize(faceWidth)
      .toBuffer();

    const composed = await santa
      .resize(
        santaMeta.width * scale,
        santaMeta.height * scale
      )
      .composite([
        {
          input: face,
          left: Math.round(santaMeta.width * 0.325 * scale),
          top: Math.round(santaMeta.height * 0.18 * scale),
        },
      ])
      .jpeg({ quality: hiRes ? 95 : 80 })
      .toBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.send(composed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Compositing failed" });
  }
}
