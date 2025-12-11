// api/generate.js
import { allowCors } from "./_lib/cors.js";
import { createJob } from "./_lib/jobs.js";

export default async function handler(req, res) {
  // Enable CORS
  allowCors(res);

  // Respond immediately to preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Normal logic
  const job = await createJob();
  return res.status(200).json(job);
}
