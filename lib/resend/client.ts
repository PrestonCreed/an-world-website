// lib/resend/client.ts
import 'server-only';
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);
export const EMAIL_FROM_DEFAULT =
  process.env.EMAIL_FROM_DEFAULT || 'AN World <noreply@an.world>';
