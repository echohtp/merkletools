import { PrismaClient } from '@prisma/client'
import { Keypair } from '@solana/web3.js'

const prisma = new PrismaClient()

async function main() {
  const kp = new  Keypair()
  const user = await prisma.wallet.create({
    data: {
      privateKey: Buffer.from(kp.secretKey).toString('base64'),
      publicKey: kp.publicKey.toBase58(),
    },
  })


  const users = await prisma.wallet.findMany()
  console.log(users)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
