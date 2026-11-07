import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/account', '/intel/tecno-ch6i', '/intel/iphone-11'],
    },
    sitemap: 'https://www.thegoatinitiative.org/sitemap.xml',
  }
}
