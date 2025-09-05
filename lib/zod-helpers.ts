import { NextResponse } from "next/server";
import { ZodError, ZodTypeAny } from "zod";

export function parseOrThrow<T extends ZodTypeAny>(schema: T, data: unknown) {
  return schema.parseAsync(data);
}

export function zodErrorResponse(err: ZodError, status = 400) {
  const issues = err.issues.map(i => ({
    path: i.path.join("."),
    code: i.code,
    message: i.message,
  }));
  return NextResponse.json({ error: "invalid_request", issues }, { status });
}
