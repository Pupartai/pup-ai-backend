import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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

    const output = await replicate.run(
      "stability-ai/sdxl",
      {
        input: {
          prompt:
            "A realistic Christmas Santa dog portrait, Santa suit, beard, festive lighting, studio quality",
          image: facePng,
          strength: 0.25,
          width: hiRes ? 2048 : 1024,
          height: hiRes ? 2048 : 1024,
        },
      }
    );

    res.status(200).json({ imageUrl: output[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Composite failed" });
  }
}
