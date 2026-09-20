import type { NextConfig } from "next";

const nextConfig = async (): Promise<NextConfig> => {
  if (process.env.VERCEL === "1") {
    const token = String(process.env.VERCEL_OIDC_TOKEN || "").trim();
    if (!token) throw new Error("JEV_GATEWAY_CREDITS: no_oidc");

    const response = await fetch("https://ai-gateway.vercel.sh/v1/credits", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "ai-gateway-protocol-version": "0.0.1",
        "ai-gateway-auth-method": "oidc",
        "x-vercel-ai-gateway-team": "team_E2whOLyMaYCmXQqxXkQ3ZoeK",
      },
      signal: AbortSignal.timeout(7000),
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`JEV_GATEWAY_CREDITS: HTTP ${response.status}`);
    const payload = await response.json();
    if (typeof payload?.balance !== "string") throw new Error("JEV_GATEWAY_CREDITS: unexpected_shape");
    console.log("JEV_GATEWAY_CREDITS=PASS");
  }
  return {};
};

export default nextConfig;
