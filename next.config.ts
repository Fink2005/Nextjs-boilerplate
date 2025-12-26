import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/libs/i18n.ts');

const baseConfig = {
  poweredByHeader: false,
  reactStrictMode: false,
};

const config = withNextIntl(baseConfig);

// ✅ Attach rewrites AFTER plugin
const finalConfig = {
  ...config,
  async rewrites() {
    console.log('✅ Rewrites function called');
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_SERVER;
    if (!apiBase) {
      console.warn('❌ NEXT_PUBLIC_API_BASE_SERVER is not defined! Rewrites will be skipped.');
      return [];
    }
    return [
      {
        source: '/request/:path*',
        destination: `${apiBase}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*', // Áp dụng cho tất cả các route
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

};

export default finalConfig;
