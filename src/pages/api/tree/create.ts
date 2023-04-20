// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { Keypair, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js'
import { WrapperConnection } from '@/ReadApi/WrapperConnection'
import { createTree } from '@/utils/compression'
import { numberFormatter } from '@/utils/helpers'
import { ValidDepthSizePair, getConcurrentMerkleTreeAccountSize } from '@solana/spl-account-compression'
import bs58 from 'bs58'


type Data = {
  trees: any[]
}

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  

  const CLUSTER_URL = process.env.RPC_URL ?? clusterApiUrl("devnet");

  // create a new rpc connection, using the ReadApi wrapper
  const connection = new WrapperConnection(CLUSTER_URL);

  // load keypair for the payer
  const SKua = bs58.decode(process.env.SK!)
  const payer = Keypair.fromSecretKey(SKua)

  console.log("Payer address:", payer.publicKey.toBase58());


  // get the payer's starting balance (only used for demonstration purposes)
  let initBalance = await connection.getBalance(payer.publicKey);

  console.log(
    "Starting account balance:",
    numberFormatter(initBalance / LAMPORTS_PER_SOL),
    "SOL\n",
  );



  /*
    Define our tree size parameters
  */


    const dspArr: ValidDepthSizePair[] = [
      {
        maxDepth: 3,
        maxBufferSize: 8
      },
      {
        maxDepth: 14,
        maxBufferSize: 64
      },
      {
        maxDepth: 17,
        maxBufferSize: 64
      },
      {
        maxDepth: 20,
        maxBufferSize: 256
      },
      {
        maxDepth: 30,
        maxBufferSize: 2048
      },
    ]


  const maxDepthSizePair: ValidDepthSizePair = dspArr[JSON.parse(req.body).size]

  const canopyDepth = maxDepthSizePair.maxDepth - 5;

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /*
    For demonstration purposes, we can compute how much space our tree will 
    need to allocate to store all the records. As well as the cost to allocate 
    this space (aka minimum balance to be rent exempt)
    ---
    NOTE: These are performed automatically when using the `createAllocTreeIx` 
    function to ensure enough space is allocated, and rent paid.
  */

  // calculate the space available in the tree
  const requiredSpace = getConcurrentMerkleTreeAccountSize(
    maxDepthSizePair.maxDepth,
    maxDepthSizePair.maxBufferSize,
    canopyDepth,
  );

  const storageCost = await connection.getMinimumBalanceForRentExemption(requiredSpace);

  // demonstrate data points for compressed NFTs
  console.log("Space to allocate:", numberFormatter(requiredSpace), "bytes");
  console.log("Estimated cost to allocate space:", numberFormatter(storageCost / LAMPORTS_PER_SOL));
  console.log(
    "Max compressed NFTs for collection:",
    numberFormatter(Math.pow(2, maxDepthSizePair.maxDepth)),
    "\n",
  );

  // ensure the payer has enough balance to create the allocate the Merkle tree
  if (initBalance < storageCost) return console.error("Not enough SOL to allocate the merkle tree");
  // printConsoleSeparator();


  // define the address the tree will live at
  const treeKeypair = Keypair.generate();

  // create and send the transaction to create the tree on chain
  const tree = await createTree(connection, payer, treeKeypair, maxDepthSizePair, canopyDepth);


  console.log("new tree")
  console.log(tree)


  await prisma.tree.create({
    data: {
      treeAuthority: tree.treeAuthority.toBase58(),
      treeAddress: tree.treeAddress.toBase58(),
    },
  })

  const trees = await prisma.tree.findMany()

  res.status(200).json({ trees: trees })
}



