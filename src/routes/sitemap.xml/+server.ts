import { writeupModel } from '$lib/server/mongo'
import dayjs from 'dayjs'

export async function GET({ setHeaders }) {
  setHeaders({
    'Content-Type': 'application/xml',
  })

  const result = (await writeupModel
    .find({}, { _id: false })
    .sort({ date: -1 })
    .lean()
    .exec()) as Writeup[]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>https://jacksansom.com</loc>
<changefreq>daily</changefreq>
<priority>1.0</priority>
</url>
${result
  .map(
    (post) => `
<url>
<loc>https://jacksansom.com${post.link}</loc>
<changefreq>weekly</changefreq>
<lastmod>${dayjs.unix(post.date).toISOString()}</lastmod>
</url>
`
  )
  .join('')}
</urlset>`
  return new Response(sitemap)
}
