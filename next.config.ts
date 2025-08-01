
import 'dotenv/config';
import type {NextConfig} from 'next';

const r2Hostname = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL).hostname
  : undefined;

const remotePatterns: NextConfig['images']['remotePatterns'] = [
  {
    protocol: 'https',
    hostname: 'placehold.co',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'templates.themekit.dev',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'pub-8fe748634fad4596b4e1c41b579fb2ea.r2.dev',
    port: '',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'bucket-gmt.c-ss.co.id',
    port: '',
    pathname: '/**',
  }
];

if (r2Hostname) {
  remotePatterns.push({
    protocol: 'https',
    hostname: r2Hostname,
    port: '',
    pathname: '/**',
  });
}

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns,
  },
};

export default nextConfig;
