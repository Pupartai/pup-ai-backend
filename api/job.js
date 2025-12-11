import { getJob } from "./_lib/jobs";

export default function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  const job = getJob(id);

  if (!job) {
    return res.status(404).json({ id, state: "not_found" });
  }

  return res.status(200).json(job);
}
