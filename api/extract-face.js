import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("POST only");
  }

  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: "Missing imageUrl" });
    }

    const output = await replicate.run(
      "zsxkib/bi-refnet",
      {
        input: { image: imageUrl }
      }
    );

    return res.status(200).json({ facePng: output });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Face extraction failed" });
  }
}
