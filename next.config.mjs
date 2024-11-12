/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.myanimelist.net',
          port: '',
          pathname: '/images/**',
        },
        {
          protocol: 'https',
          hostname: 'cloud.appwrite.io',
          port: '',
          pathname: '/images/**',
        },
        {
          protocol: 'https',
          hostname: 'pic.re',
          port: '',
          pathname: '/images/**',
        }
      ],
    },
  };
  
  export default nextConfig;
  