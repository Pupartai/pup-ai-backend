// api/generate.js

// Very simple in-memory job store
const jobs = global.jobs || (global.jobs = {});

export default function handler(req, res) {
  // Create job ID
  const id = Math.random().toString(36).substring(2, 10);

  // Save job
  jobs[id] = { id, state: "processing" };

  // Simulate finishing after 2 seconds
  setTimeout(() => {
    jobs[id].state = "finished";
  }, 2000);

  return res.status(200).json({
    id,
    state: "processing"
  });
}
