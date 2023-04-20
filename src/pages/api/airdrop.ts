// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'

import type { NextApiRequest, NextApiResponse } from 'next'
import bs58 from 'bs58'
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from '@solana/web3.js';

type Data = {
  balance?: number
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const prisma = new PrismaClient()

  console.log("We got an airdrop request")
  console.log(JSON.parse(req.body).address)
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const airdropSignature = await connection.requestAirdrop(
    new PublicKey(JSON.parse(req.body).address),
    LAMPORTS_PER_SOL
  );

  try {
    const resp = await connection.confirmTransaction(airdropSignature);
    const balance = await connection.getBalance(new PublicKey(JSON.parse(req.body).address))
    console.log("new balance: ", balance)
    const updateWallet = await prisma.wallet.update({
      where: {
        id: JSON.parse(req.body).id,
      },
      data: {
        balance: balance / LAMPORTS_PER_SOL,
      },
    })

    res.status(200).json({ balance: balance })
  } catch {
    res.status(500).json({ error: "Error" })
  }
}
