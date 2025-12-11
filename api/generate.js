// api/generate.js
import { createJob } from "./_lib/jobs";

export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const job = await createJob();
    return res.status(200).json(job);
  } catch (err) {
    console.error("Error creating job:", err);
    return res.status(500).json({ error: "Failed to create job" });
  }
}
