/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // <=== Tells Next.js to compile files into flat HTML/CSS
  images: {
    unoptimized: true, // <=== Required because GitHub has no image-optimization server
  },
  // If your GitHub repository link is ://github.com, 
  // uncomment the line below and change '/my-task-app' to match your exact repository name!
  // basePath: '/my-task-app', 
};

module.exports = nextConfig;
