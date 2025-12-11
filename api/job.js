// api/job.js

// simple in-memory job store (Vercel resets this every request, but it's fine for mocking)
const jobs = {};

export default function handler(req, res) {
  const { id } = req.query;

  // If no id provided
  if (!id) {
    return res.status(400).json({ error: "Missing job id" });
  }

  // If job doesn't exist
  if (!jobs[id]) {
    return res.status(404).json({ id, state: "not_found" });
  }

  // Return job state
  return res.status(200).json(jobs[id]);
}
