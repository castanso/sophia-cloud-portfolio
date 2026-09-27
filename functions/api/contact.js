const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
});

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    if (data.company_website) return json({ ok: true });
    const name = String(data.name || '').trim().slice(0, 100);
    const email = String(data.email || '').trim().slice(0, 160);
    const subject = String(data.subject || '').trim().slice(0, 140);
    const message = String(data.message || '').trim().slice(0, 3000);
    if (!name || !subject || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Please complete every field with a valid email.' }, 400);
    }
    if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
      return json({ error: 'The contact form is being configured. Please use LinkedIn for now.' }, 503);
    }
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `Portfolio message: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`
      })
    });
    if (!response.ok) return json({ error: 'Your message could not be sent. Please try again later.' }, 502);
    return json({ ok: true });
  } catch {
    return json({ error: 'Your message could not be sent. Please try again.' }, 500);
  }
}

export function onRequest() {
  return json({ error: 'Method not allowed.' }, 405);
}
