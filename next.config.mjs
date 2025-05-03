/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['api.qrserver.com'], // Add the QR code server's hostname here
    },
  };
  
export default nextConfig;

