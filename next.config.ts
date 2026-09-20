import type { NextConfig } from "next";

const nextConfig = async (): Promise<NextConfig> => {
  if (process.env.VERCEL === "1") {
    const token = String(process.env.VERCEL_OIDC_TOKEN || "").trim();
    if (!token) throw new Error("JEV_POST_ENABLE_PROBE: no_oidc");

    const response = await fetch("https://ai-gateway.vercel.sh/v4/ai/evaluation-model", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ai-gateway-protocol-version": "0.0.1",
        "ai-gateway-auth-method": "oidc",
        "ai-evaluation-model-specification-version": "4",
        "ai-model-id": "typesafe-ai/jev"
      },
      body: JSON.stringify({
        state: "The deployment completed successfully.",
        questions: {
          completed: {
            type: "boolean",
            instructions: "Did the deployment complete successfully?"
          }
        },
        providerOptions: { gateway: { zeroDataRetention: true } }
      }),
      signal: AbortSignal.timeout(7000),
      cache: "no-store"
    });

    if (!response.ok) throw new Error(`JEV_POST_ENABLE_PROBE: HTTP ${response.status}`);
    const payload = await response.json();
    if (!payload?.answers?.completed) throw new Error("JEV_POST_ENABLE_PROBE: bad_shape");
    console.log("JEV_POST_ENABLE_PROBE=PASS");
  }
  return {};
};

export default nextConfig;
