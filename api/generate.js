// api/generate.js
import { createJob } from "./_lib/jobs";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://pupartai.com");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const job = await createJob();
  return res.status(200).json(job);
}
