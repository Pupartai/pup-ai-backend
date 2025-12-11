// api/job.js
import { allowCors } from "./_lib/cors.js";
import { getJob } from "./_lib/jobs.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://pupartai.com");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // existing job lookup code...
}


  const id = req.query.id;
  if (!id) return res.status(400).json({ ok: false, error: "Missing id" });

  const job = await getJob(id);
  if (!job) return res.status(404).json({ ok: false, error: "Job not found" });

  return res.status(200).json({ ok: true, job });
}
