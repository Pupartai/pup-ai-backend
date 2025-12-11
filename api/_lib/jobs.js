// api/_lib/jobs.js
// Shared in-memory job store for mock environment

const jobs = {};

export function createJob() {
  const id = Math.random().toString(36).substring(2, 10);
  jobs[id] = { id, state: "processing" };

  // Auto-finish job after 2 seconds
  setTimeout(() => {
    jobs[id].state = "finished";
  }, 2000);

  return jobs[id];
}

export function getJob(id) {
  return jobs[id] || null;
}
