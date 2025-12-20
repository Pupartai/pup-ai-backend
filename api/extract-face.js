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
    "cjwbw/rembg@sha256:4b6d3c2f6d6f6f2a9d6e8f1b4e9a2b8f6c7d9e1f2a3b4c5d6e7f8a9b0",
    {
      input: {
        image: imageUrl
      }
    }
  );

    return res.status(200).json({ facePng: output });
  } catch (err) {
  console.error("REPLICATE ERROR:", err);
  return res.status(500).json({ error: err.message || "Face extraction failed" });
}
}
