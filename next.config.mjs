/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.glasses.com', 'uftxluevyvvmnbdndgyr.supabase.co'],
  },
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
  },
};

export default nextConfig;
