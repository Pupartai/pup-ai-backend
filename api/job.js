import { getJob } from "./_lib/jobQueue";

export default function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        ok: false,
        error: "Missing job ID"
      });
    }

    const job = getJob(id);

    if (!job) {
      return res.status(404).json({
        ok: false,
        id,
        status: "not_found"
      });
    }

    return res.status(200).json({
      ok: true,
      id: job.id,
      status: job.state
    });
  } catch (err) {
    console.error("JOB ENDPOINT ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: "Server error",
      details: err.message
    });
  }
}
