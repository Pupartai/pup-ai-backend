// api/generate.js
import { createJob } from "./_lib/jobs";

export default function handler(req, res) {
  const id = createJob();

  return res.status(200).json({
    id,
    state: "processing"
  });
}
