// api/job/[id].js
import { getJob } from "../../../lib/jobQueue.js";

export default async function handler(req, res) {
  const { id } = req.query;

  const job = getJob(id);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  return res.status(200).json({
    jobId: job.id,
    state: job.state
  });
}
