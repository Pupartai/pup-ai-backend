// api/finish-jobs.js
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  let cursor = 0;
  let updated = 0;

  do {
    const result = await kv.scan(cursor, { match: "job:*", count: 100 });
    cursor = result.cursor;

    for (const key of result.keys) {
      const job = await kv.hgetall(key);

      if (job && job.state === "processing") {
        await kv.hset(key, { state: "finished" });
        updated++;
      }
    }
  } while (cursor !== 0);

  return res.status(200).json({ ok: true, updated });
}
