export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await fetch(process.env.ZAPIER_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  res.status(200).json({ ok: true });
}
