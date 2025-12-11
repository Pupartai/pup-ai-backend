import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  try {
    await kv.set("test-key", "hello-world");
    const value = await kv.get("test-key");

    return res.status(200).json({
      ok: true,
      value
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message,
      stack: err.stack
    });
  }
}
