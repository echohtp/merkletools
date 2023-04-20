// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  collectors: string[]
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const creators = {
    "dp": ["apple", "banana", "strawberry"],
    "0xb": ["orange", "pineapple", "melon"],
    "0xg": ["grape", "strawberry", "lemon"]
  }
  
  if (JSON.parse(req.body).creator == "dp")
    res.status(200).json({ collectors: creators['dp'] })
  else if (JSON.parse(req.body).creator == "0xb")
    res.status(200).json({ collectors: creators['0xb'] })
  else if (JSON.parse(req.body).creator == "0xg")
    res.status(200).json({ collectors: creators['0xg'] })
  else
    res.status(200).json({ collectors: [] })
}
