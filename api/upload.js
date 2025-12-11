// api/upload.js
export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { filename, contentBase64 } = req.body || {};

  if (!filename || !contentBase64) {
    return res.status(400).json({ error: "Missing filename or contentBase64" });
  }

  // For now, store nothing — just simulate an uploadId.
  const uploadId = Math.random().toString(36).substring(2, 10);

  return res.status(200).json({
    message: "Upload received",
    uploadId: uploadId
  });
}
