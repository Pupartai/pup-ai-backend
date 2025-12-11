import { createJob } from "./_lib/jobs";

export default async function handler(req, res) {
  const job = await createJob();
  return res.status(200).json(job);
}
