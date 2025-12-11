import { getJob } from "./_lib/jobs";

export default function handler(req, res) {
  const { id } = req.query;
  const job = getJob(id);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  return res.status(200).json(job);
}
