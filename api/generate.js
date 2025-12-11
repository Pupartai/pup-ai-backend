// api/generate.js
export default async function handler(req, res) {
  return res.status(200).json({ message: "Generate endpoint is live." });
}
