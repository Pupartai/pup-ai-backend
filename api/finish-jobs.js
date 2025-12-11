// api/finish-jobs.js
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  // Find all job keys
  const jobKeys = await kv.keys("job:*");

  let updated = 0;

  for (const key of jobKeys) {
    const job = await kv.hgetall(key);

    if (job && job.state === "processing") {
      await kv.hset(key, { state: "finished" });
      updated++;
    }
  }

  return res.status(200).json({ ok: true, updated });
}
