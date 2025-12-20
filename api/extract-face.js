import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  // CORS (MUST be inside handler)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).send("POST only");
  }

  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: "Missing imageUrl" });
    }

  const output = await replicate.run(
    "cjwbw/rembg:5c7f9e9a9d5c8e9c8b2a8c5c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4",
    {
      input: { image: imageUrl }
    }
  );

    return res.status(200).json({ facePng: output });
  } catch (err) {
  console.error("REPLICATE ERROR:", err);
  return res.status(500).json({ error: err.message || "Face extraction failed" });
}
}
