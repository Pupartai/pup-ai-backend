import { createJob } from "./_lib/jobs";

export default function handler(req, res) {
  const job = createJob();
  return res.status(200).json(job);
}
