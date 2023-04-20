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

    console.log("Setting a new in use wallet")
    const walletId = JSON.parse(req.body).id
    console.log("setting wallet in use: ", walletId)


    const oldWallet = await prisma.wallet.findFirst({
        where:{
            selected: true
        }
    })
    console.log(oldWallet)
    await prisma.wallet.update({
        where:{
            id: Number(oldWallet?.id)
        },
        data:{
            selected: false
        }

    })

    await prisma.wallet.update({
        where:{
            id: Number(walletId)
        },
        data: {
            selected: true
        }
    })
 
    res.status(200).json({ wallets: walletId })
}



