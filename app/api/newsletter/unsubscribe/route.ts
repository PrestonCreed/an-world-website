// app/api/newsletter/unsubscribe/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';

function verifySignature(email: string, signature?: string | null) {
  const secret = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET;
  if (!secret) return true; // allow if no secret configured
  if (!signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(email).digest('hex').slice(0, 16);
  return signature === expected;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const email = url.searchParams.get('email');
  const s = url.searchParams.get('s'); // optional signature

  if (!email) {
    return new NextResponse(htmlPage('Missing email', false), {
      headers: { 'content-type': 'text/html' },
      status: 400,
    });
  }
  if (!verifySignature(email, s)) {
    return new NextResponse(htmlPage('Invalid or expired unsubscribe link', false), {
      headers: { 'content-type': 'text/html' },
      status: 401,
    });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
    .eq('email', email);

  if (error) {
    return new NextResponse(htmlPage('Unexpected error — try again later', false), {
      headers: { 'content-type': 'text/html' },
      status: 500,
    });
  }

  return new NextResponse(htmlPage('You have been unsubscribed.'), {
    headers: { 'content-type': 'text/html' },
  });
}

function htmlPage(message: string, ok = true) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>${ok ? 'Unsubscribed' : 'Error'}</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { background:#000; color:#fff; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; display:grid; place-items:center; height:100vh; margin:0; }
  .card { width:min(560px, 92vw); border:1px solid rgba(255,255,255,0.12); border-radius:16px; padding:24px; background:linear-gradient(180deg, rgba(2,22,71,0.35) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.6) 100%); box-shadow:0 0 24px rgba(15,126,221,0.33); }
  h1 { margin:0 0 10px 0; font-size:22px; }
  p { margin:8px 0 0 0; line-height:1.55; color:rgba(255,255,255,0.8) }
</style>
</head>
<body><div class="card">
<h1>${ok ? 'AN World — Unsubscribe' : 'AN World'}</h1>
<p>${message}</p>
</div></body></html>`;
}
