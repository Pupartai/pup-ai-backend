// api/finish-jobs.js
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  // list job keys
  const keys = await kv.keys("job:*");

  for (const key of keys) {
    const job = await kv.hgetall(key);

    if (job.state === "processing") {
      await kv.hset(key, { state: "finished" });
    }
  }

  return res.status(200).json({ ok: true, updated: keys.length });
}
