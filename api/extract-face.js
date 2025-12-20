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
    "stability-ai/background-removal",
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
