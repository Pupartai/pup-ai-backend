
// lib/jobQueue.js
// Temporary in-memory job store (used only in development)

let jobs = {};

export function createJob() {
  const id = Math.random().toString(36).substring(2, 10);
  jobs[id] = { id, state: "processing" };

  // Simulate job finishing after 1 second
  setTimeout(() => {
    jobs[id].state = "finished";
  }, 1000);

  return id;
}

export function getJob(id) {
  return jobs[id] || null;
}
