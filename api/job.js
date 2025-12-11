import { getJob } from "./_lib/jobQueue";

export default function handler(req, res) {
  try {
    const { id } = req.query;

    const job = getJob(id);

    return res.status(200).json({
      ok: true,
      received: id,
      job,
    });
  } catch (err) {
    console.error("JOB ENDPOINT ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
}
