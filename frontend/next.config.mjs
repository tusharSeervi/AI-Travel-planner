/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'https://ai-travel-planner-0o39.onrender.com/api',
  },
};

export default nextConfig;
