// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'

import type { NextApiRequest, NextApiResponse } from 'next'
import bs58 from 'bs58'
import { Keypair } from '@solana/web3.js';

type Data = {
  wallets: any[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    const prisma = new PrismaClient()

    const wallets = await prisma.wallet.findMany()

    res.status(200).json({ wallets: wallets })
}
