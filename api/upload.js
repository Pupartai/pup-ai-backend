// api/upload.js
export default async function handler(req, res) {
  return res.status(200).json({ message: "Upload endpoint is live." });
}
