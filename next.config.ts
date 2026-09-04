import type { NextConfig } from "next";

// No `output: "standalone"` here. That mode is for self-hosting; it relocates the
// output-file trace and Vercel's builder then dies on a missing next-server.js.nft.json.
const nextConfig: NextConfig = {};

export default nextConfig;
