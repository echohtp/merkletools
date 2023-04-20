// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { Keypair } from '@solana/web3.js'


type Data = {
  wallets: any[]
}

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {


    const beforeWallets = await prisma.wallet.findMany()

    const kp = new  Keypair()
    
    const user = await prisma.wallet.create({
    data: {
      privateKey: Buffer.from(kp.secretKey).toString('base64'),
      publicKey: kp.publicKey.toBase58(),
      selected: (beforeWallets.length == 0)? true : false
    },
  })


  const wallets = await prisma.wallet.findMany()
 
    res.status(200).json({ wallets: wallets })
}



