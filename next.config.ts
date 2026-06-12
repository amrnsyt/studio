/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // <=== CRITICAL: Tells Next.js to generate the missing "./out" folder
  images: {
    unoptimized: true, // <=== CRITICAL: Stops images from causing a build crash on GitHub
  },
};

module.exports = nextConfig;
