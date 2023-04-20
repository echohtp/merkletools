// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'

import type { NextApiRequest, NextApiResponse } from 'next'
import bs58 from 'bs58'
import { Keypair } from '@solana/web3.js';

type Data = {
  trees: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    const prisma = new PrismaClient()

    const trees = await prisma.tree.findMany()

    res.status(200).json({ trees: trees })
}
