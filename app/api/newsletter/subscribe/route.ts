// app/api/newsletter/subscribe/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export async function POST(req: NextRequest) {
  const supabase = createSupabaseAdminClient();

  const body = await req.json().catch(() => ({}));
  const { email, firstName, lastName, source = 'site_form', tags = [] } = body || {};

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .upsert(
      {
        email,
        first_name: firstName || null,
        last_name: lastName || null,
        status: 'subscribed',
        source,
        tags,
        confirmed_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, subscriber: data });
}
