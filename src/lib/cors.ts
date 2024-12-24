// lib/cors.js
import { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'

export async function runCors(req: NextApiRequest, res: NextApiResponse) {
  // Configure it however you want
  return NextCors(req, res, {
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: '*',
    allowedHeaders: ['Content-Type', 'Accept', 'X-Requested-With', 'Origin'],
  })
}
