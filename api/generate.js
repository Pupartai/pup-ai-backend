// api/generate.js
import { createJob } from "./_lib/jobQueue.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // In Phase 2 this will include real AI inputs.
  const jobId = createJob();

  return res.status(200).json({
    message: "Job started",
    jobId: jobId
  });
}
