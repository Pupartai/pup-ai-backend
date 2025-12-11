// api/finish-jobs.js
import { allowCors } from "./_lib/cors.js";
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  // Enable CORS
  allowCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const keys = await kv.keys("job:*");
  let updated = 0;

  for (const key of keys) {
    const job = await kv.hgetall(key);
    if (job?.state === "processing") {
      await kv.hset(key, { state: "finished" });
      updated++;
    }
  }

  return res.status(200).json({ ok: true, updated });
}
