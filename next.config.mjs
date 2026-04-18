/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "images.unsplash.com",
      "randomuser.me",
      "res.cloudinary.com",
      "flagcdn.com",
    ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};
export default nextConfig;
