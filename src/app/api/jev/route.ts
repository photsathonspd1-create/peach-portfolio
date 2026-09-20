import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 5;

const MODEL_ID = "typesafe-ai/jev";
const GATEWAY_URL = "https://ai-gateway.vercel.sh/v4/ai/evaluation-model";
const CUTOFF_MS = Date.parse("2026-09-25T16:59:59.999Z"); // 25 Sep 2026 23:59:59 Asia/Bangkok
const MAX_BODY_BYTES = 6_000;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;

const buckets = new Map<string, { startedAt: number; count: number }>();

function noStore(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function redact(value: unknown, max = 1200) {
  let text = String(value ?? "");
  text = text.replace(/\b(Bearer\s+)[A-Za-z0-9._~+\/-]+/gi, "$1[redacted]");
  text = text.replace(/\b(api[_-]?key|token|secret|password|passwd|pwd)\b\s*[:=]\s*([^\s,;&]+)/gi, "$1=[redacted]");
  text = text.replace(/(--(?:api[_-]?key|token|secret|password)\s+)([^\s]+)/gi, "$1[redacted]");
  text = text.replace(/\b[A-Za-z0-9_-]{40,}\b/g, "[redacted-long-value]");
  return text.slice(0, max);
}

function stateFrom(input: Record<string, unknown> = {}) {
  const flags = input.flags && typeof input.flags === "object" ? input.flags as Record<string, unknown> : {};
  const deterministic = input.deterministic && typeof input.deterministic === "object"
    ? input.deterministic as Record<string, unknown>
    : {};
  return {
    action: redact(input.action, 240),
    command: redact(input.command, 1200),
    path: redact(input.path, 480),
    target: redact(input.target, 480),
    capability: redact(input.capability, 240),
    flags: {
      destructive: Boolean(flags.destructive),
      production: Boolean(flags.production),
      external: Boolean(flags.external),
      sensitivity: redact(flags.sensitivity || "normal", 80),
    },
    deterministic: {
      score: Math.max(0, Math.min(100, Number(deterministic.score || 0))),
      decision: redact(deterministic.decision || "auto", 40),
      reasons: Array.isArray(deterministic.reasons)
        ? deterministic.reasons.slice(0, 8).map((x) => redact(x, 200))
        : [],
    },
  };
}

function allowRequest(req: NextRequest) {
  const raw = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const ip = raw.split(",")[0].trim().slice(0, 80);
  const now = Date.now();
  const current = buckets.get(ip);
  if (!current || now - current.startedAt >= RATE_WINDOW_MS) {
    buckets.set(ip, { startedAt: now, count: 1 });
    return true;
  }
  current.count += 1;
  return current.count <= RATE_MAX;
}

async function evaluate(state: ReturnType<typeof stateFrom>) {
  const oidc = String(process.env.VERCEL_OIDC_TOKEN || "").trim();
  if (!oidc) return { ok: false as const, status: 503, error: "vercel_oidc_unavailable" };

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${oidc}`,
      "Content-Type": "application/json",
      "ai-gateway-protocol-version": "0.0.1",
      "ai-gateway-auth-method": "oidc",
      "ai-model-id": MODEL_ID,
    },
    body: JSON.stringify({
      state,
      questions: {
        oversight: {
          type: "choice",
          instructions:
            "Given the proposed software action and deterministic LocalForge risk result, choose the minimum additional oversight required. Never reduce the deterministic safety level.",
          criteria: {
            keep: "The deterministic LocalForge decision is already sufficiently cautious.",
            review: "A reviewer should inspect this before it runs because intent, scope, reversibility, or external impact is ambiguous.",
            approval: "Explicit human approval should be required because this affects credentials, production, money, sensitive data, permissions, or has difficult-to-reverse impact.",
          },
        },
      },
      providerOptions: { gateway: { zeroDataRetention: true } },
    }),
    signal: AbortSignal.timeout(3500),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    return { ok: false as const, status: 502, error: `gateway_http_${response.status}` };
  }
  return {
    ok: true as const,
    answer: payload?.answers?.oversight ?? null,
    usage: payload?.usage ?? null,
  };
}

function expired() {
  return Date.now() > CUTOFF_MS;
}

export async function POST(req: NextRequest) {
  if (expired()) return noStore({ ok: false, error: "jev_window_expired" }, 410);
  if (!allowRequest(req)) return noStore({ ok: false, error: "rate_limited" }, 429);

  const raw = await req.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
    return noStore({ ok: false, error: "payload_too_large" }, 413);
  }

  let input: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw || "{}");
    input = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return noStore({ ok: false, error: "invalid_json" }, 400);
  }

  try {
    const result = await evaluate(stateFrom(input));
    if (!result.ok) return noStore({ ok: false, model: MODEL_ID, error: result.error }, result.status);
    return noStore({ ok: true, model: MODEL_ID, answer: result.answer, usage: result.usage });
  } catch (error) {
    const name = error instanceof Error ? error.name : "Error";
    return noStore({ ok: false, model: MODEL_ID, error: name === "TimeoutError" ? "timeout" : "gateway_error" }, 502);
  }
}

export async function GET(req: NextRequest) {
  if (expired()) return noStore({ ok: false, error: "jev_window_expired" }, 410);
  if (req.nextUrl.searchParams.get("probe") !== "1") {
    return noStore({ ok: true, model: MODEL_ID, temporary: true, cutoff: "2026-09-25T16:59:59.999Z" });
  }
  if (!allowRequest(req)) return noStore({ ok: false, error: "rate_limited" }, 429);

  try {
    const result = await evaluate(
      stateFrom({
        action: "deploy",
        command: "deploy verified source to a production-like preview",
        flags: { external: true, production: false, destructive: false },
        deterministic: { score: 35, decision: "review", reasons: ["External/network mutation"] },
      })
    );
    if (!result.ok) return noStore({ ok: false, model: MODEL_ID, error: result.error }, result.status);
    return noStore({ ok: true, model: MODEL_ID, probe: true, answer: result.answer, usage: result.usage });
  } catch (error) {
    const name = error instanceof Error ? error.name : "Error";
    return noStore({ ok: false, model: MODEL_ID, error: name === "TimeoutError" ? "timeout" : "gateway_error" }, 502);
  }
}
