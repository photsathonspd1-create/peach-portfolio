import type { NextConfig } from "next";

const nextConfig = async (): Promise<NextConfig> => {
  // One-commit verification gate for the temporary Jev integration.
  // The next commit restores this file after Vercel proves the OIDC path live.
  if (process.env.VERCEL === "1") {
    const token = String(process.env.VERCEL_OIDC_TOKEN || "").trim();
    if (!token) throw new Error("JEV_TEMP_BUILD_PROBE: missing VERCEL_OIDC_TOKEN");

    const response = await fetch("https://ai-gateway.vercel.sh/v4/ai/evaluation-model", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ai-gateway-protocol-version": "0.0.1",
        "ai-gateway-auth-method": "oidc",
        "ai-model-id": "typesafe-ai/jev",
      },
      body: JSON.stringify({
        state: {
          action: "deploy",
          target: "temporary Jev verification",
          deterministic: {
            score: 35,
            decision: "review",
            reasons: ["External/network mutation"],
          },
        },
        questions: {
          oversight: {
            type: "choice",
            instructions:
              "Given the proposed software action and deterministic risk result, choose the minimum additional oversight required. Never reduce the deterministic safety level.",
            criteria: {
              keep: "The deterministic decision is sufficiently cautious.",
              review: "A reviewer should inspect the action before it runs.",
              approval: "Explicit human approval should be required before it runs.",
            },
          },
        },
        providerOptions: { gateway: { zeroDataRetention: true } },
      }),
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`JEV_TEMP_BUILD_PROBE: gateway HTTP ${response.status}`);
    }
    const payload = await response.json();
    if (!payload?.answers?.oversight) {
      throw new Error("JEV_TEMP_BUILD_PROBE: missing oversight answer");
    }
    console.log("JEV_TEMP_BUILD_PROBE=PASS model=typesafe-ai/jev");
  }

  return {};
};

export default nextConfig;
