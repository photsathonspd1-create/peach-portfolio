import type { NextConfig } from "next";

const nextConfig = async (): Promise<NextConfig> => {
  if (process.env.VERCEL === "1") {
    const token = String(process.env.VERCEL_OIDC_TOKEN || "").trim();
    if (!token) throw new Error("JEV_PROBE_403: no_oidc");

    const response = await fetch("https://ai-gateway.vercel.sh/v4/ai/evaluation-model", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ai-gateway-protocol-version": "0.0.1",
        "ai-gateway-auth-method": "oidc",
        "ai-evaluation-model-specification-version": "4",
        "ai-model-id": "typesafe-ai/jev",
      },
      body: JSON.stringify({
        state: "The support agent issued a full refund to the customer.",
        questions: {
          refunded: { type: "boolean", instructions: "Was a refund issued?" },
        },
      }),
      signal: AbortSignal.timeout(7000),
      cache: "no-store",
    });

    if (response.ok) {
      const payload = await response.json();
      if (!payload?.answers?.refunded) throw new Error("JEV_PROBE_403: bad_success_shape");
      console.log("JEV_PROBE_403=LIVE_SUCCESS");
      return {};
    }

    if (response.status === 403) {
      console.log("JEV_PROBE_403=PASS");
      return {};
    }
    throw new Error("JEV_PROBE_403: not_403");
  }
  return {};
};

export default nextConfig;
