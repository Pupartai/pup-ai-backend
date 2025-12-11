import { getJob } from "./_lib/jobs";

export default async function handler(req, res) {
  const id = req.query.id;
  if (!id) return res.status(400).json({ ok: false, error: "Missing id" });

  const job = await getJob(id);
  if (!job) return res.status(404).json({ ok: false, error: "Job not found" });

  return res.status(200).json({ ok: true, job });
}
