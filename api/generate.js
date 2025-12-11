import { createJob } from "./_lib/jobs.js";

export default async function handler(req, res) {
  const job = await createJob();
  return res.status(200).json(job);
}
