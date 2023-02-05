// @ts-check

const analyze = process.env.ANALYZE === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // comment out output when building locally with pnpm, see https://github.com/vercel/next.js/issues/40760
  output: analyze ? undefined : 'standalone',
};

if (process.env.NODE_ENV === 'production') {
  // https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: analyze,
  });
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}
