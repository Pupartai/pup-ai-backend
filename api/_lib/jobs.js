// api/_lib/jobs.js
import { kv } from "@vercel/kv";

export async function createJob() {
  const id = Math.random().toString(36).substring(2, 10);

  // Save initial job state
  await kv.hset(`job:${id}`, {
    id,
    state: "processing",
  });

  // Simulate job finishing after 2 seconds
  setTimeout(async () => {
    await kv.hset(`job:${id}`, { state: "finished" });
  }, 2000);

  return { id, state: "processing" };
}

export async function getJob(id) {
  return await kv.hgetall(`job:${id}`);
}
