import type { NextConfig } from "next";

const nextConfig = async (): Promise<NextConfig> => {
  if (process.env.VERCEL === "1") {
    const token = String(process.env.VERCEL_OIDC_TOKEN || "").trim();
    if (!token) throw new Error("JEV_TEMP_OIDC_PRESENCE: missing VERCEL_OIDC_TOKEN");
    console.log("JEV_TEMP_OIDC_PRESENCE=PASS");
  }
  return {};
};

export default nextConfig;
