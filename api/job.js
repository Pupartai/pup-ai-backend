// api/job.js

// Reuse the global job store created in generate.js
const jobs = global.jobs || (global.jobs = {});

export default function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ ok: false, error: "Missing job id" });
  }

  const job = jobs[id];

  if (!job) {
    return res.status(404).json({ ok: false, error: "Job not found" });
  }

  return res.status(200).json(job);
}
