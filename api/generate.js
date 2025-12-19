// api/generate.js
import { createJob } from "./_lib/jobs.js";

export default async function handler(req, res) {
  // ALWAYS send CORS headers for ALL requests
  res.setHeader("Access-Control-Allow-Origin", "https://pupartai.com");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const job = await createJob();
    return res.status(200).json({ ok: true, job });
  } catch (err) {
    console.error("Error creating job:", err);
    return res.status(500).json({ error: "Failed to create job" });
  }
}
