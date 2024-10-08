// pages/api/random-anime.ts
import type { NextApiRequest, NextApiResponse } from 'next'

async function fetchSingleImage() {
  const response = await fetch('https://pic.re/image', {
    method: 'GET',
    headers: {
      'Accept': 'image/jpeg',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch image')
  }

  const imageBuffer = await response.arrayBuffer()
  const headers = response.headers

  return {
    id: headers.get('image_id') || '',
    source: headers.get('image_source') || '',
    tags: headers.get('image_tags') || '',
    dataUrl: `data:image/jpeg;base64,${Buffer.from(imageBuffer).toString('base64')}`
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  try {
    const images = await Promise.all([
      fetchSingleImage(),
      fetchSingleImage(),
      fetchSingleImage()
    ])

    res.status(200).json(images)
  } catch (error) {
    console.error('Error fetching images:', error)
    res.status(500).json({ error: 'Failed to fetch images' })
  }
}