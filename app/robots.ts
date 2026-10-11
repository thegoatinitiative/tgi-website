import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/intel/tecno-ch6i'],
    },
    sitemap: 'https://www.thegoatinitiative.org/sitemap.xml',
  }
}
