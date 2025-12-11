import { getJobStatus } from "./_lib/jobQueue";

export default function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        ok: false,
        error: "Missing job ID"
      });
    }

    // Get job status from in-memory queue
    const status = getJobStatus(id);

    return res.status(200).json({
      ok: true,
      id,
      status
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
