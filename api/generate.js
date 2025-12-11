// api/generate.js

// Import the same mock job storage (copy/paste inside this file)
const jobs = {};

export default function handler(req, res) {
  // Create a fake job ID
  const id = Math.random().toString(36).substring(2, 10);

  // Store job in memory
  jobs[id] = { id, state: "processing" };

  // Simulate job finishing after 2 seconds
  setTimeout(() => {
    jobs[id].state = "finished";
  }, 2000);

  return res.status(200).json({ id, state: "processing" });
}
