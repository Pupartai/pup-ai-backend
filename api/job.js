// api/job.js
import { getJob } from "./_lib/jobs";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://pupartai.com");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing job id" });
  }

  const job = await getJob(id);

  return res.status(200).json({ job });
}
