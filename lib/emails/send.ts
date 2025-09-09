// lib/emails/send.ts
import 'server-only';
import { resend, EMAIL_FROM_DEFAULT } from '@/lib/resend/client';
import SignUpEmail from '@/emails/SignUpEmail';
import ConfirmEmail from '@/emails/ConfirmEmail';
import ResetPasswordEmail from '@/emails/ResetPasswordEmail';
import NewsletterEmail, { NewsletterProps } from '@/emails/NewsletterEmail';

type BasicTo = string | string[];

export async function sendSignUpEmail(opts: {
  to: BasicTo;
  heroTopImageUrl?: string;
  heroBottomImageUrl?: string;
  ctaUrl?: string; // default: SITE_URL
  from?: string;
}) {
  const SITE_URL = process.env.SITE_URL ?? 'http://localhost:3000';
  const { to, heroTopImageUrl, heroBottomImageUrl, ctaUrl = SITE_URL, from } = opts;

  return resend.emails.send({
    from: from || EMAIL_FROM_DEFAULT,
    to,
    subject: 'Welcome to AN World!',
    react: SignUpEmail({
      heroTopImageUrl,
      heroBottomImageUrl,
      ctaUrl
    })
  });
}

export async function sendConfirmEmail(opts: {
  to: BasicTo;
  confirmUrl: string;
  heroImageUrl?: string;
  from?: string;
}) {
  const { to, confirmUrl, heroImageUrl, from } = opts;
  return resend.emails.send({
    from: from || EMAIL_FROM_DEFAULT,
    to,
    subject: 'Please confirm your email address to sign into AN World',
    react: ConfirmEmail({ confirmUrl, heroImageUrl })
  });
}

export async function sendResetPasswordEmail(opts: {
  to: BasicTo;
  resetUrl: string;
  userEmail?: string;
  from?: string;
}) {
  const { to, resetUrl, userEmail, from } = opts;
  return resend.emails.send({
    from: from || EMAIL_FROM_DEFAULT,
    to,
    subject: 'Reset your password for an.world',
    react: ResetPasswordEmail({ resetUrl, userEmail })
  });
}

/** Send a single newsletter instance (use in a loop or later integrate Broadcasts). */
export async function sendNewsletterEmail(to: BasicTo, data: NewsletterProps, from?: string) {
  const unsubscribeUrl = data.unsubscribeUrl; // include per-user link if you have one
  return resend.emails.send({
    from: from || EMAIL_FROM_DEFAULT,
    to,
    subject: data.title || 'AN World — Weekly',
    headers: unsubscribeUrl ? { 'List-Unsubscribe': `<${unsubscribeUrl}>` } : undefined,
    react: NewsletterEmail(data)
  });
}
