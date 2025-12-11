// Temporary in-memory job store (development only)
const jobs = {};

export function createJob() {
  const id = Math.random().toString(36).substring(2, 10);
  jobs[id] = { id, state: "processing" };

  // Simulate job finishing after 3 seconds
  setTimeout(() => {
    jobs[id].state = "finished";
  }, 3000);

  return jobs[id];
}

export function getJob(id) {
  return jobs[id] || null;
}
