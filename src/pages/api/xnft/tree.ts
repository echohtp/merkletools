// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { WrapperConnection } from '@/ReadApi/WrapperConnection';
import { createTree, createCollection, mintCompressedNFT } from '@/utils/compression';
import { numberFormatter } from '@/utils/helpers';
import { CreateMetadataAccountArgsV3, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import { MetadataArgs, TokenProgramVersion } from '@metaplex-foundation/mpl-bubblegum';
import { ValidDepthSizePair, getConcurrentMerkleTreeAccountSize } from '@solana/spl-account-compression';
import { clusterApiUrl, Keypair, LAMPORTS_PER_SOL, PublicKey, Struct } from '@solana/web3.js';
import type { NextApiRequest, NextApiResponse } from 'next'
import bs58 from 'bs58'
import { serialize, deserialize, deserializeUnchecked } from "borsh";




class COption extends Struct {
  constructor(properties: any) {
    super(properties);
  }

  /**
   * Creates a COption from a PublicKey
   * @param {PublicKey?} akey
   * @returns {COption} COption
   */
  static fromPublicKey(akey?: PublicKey): COption {
    if (akey == undefined) {
      return new COption({
        noneOrSome: 0,
        pubKeyBuffer: new Uint8Array(32),
      });
    } else {
      return new COption({
        noneOrSome: 1,
        pubKeyBuffer: akey.toBytes(),
      });
    }
  }
  /**
   * @returns {Buffer} Serialized COption (this)
   */
  encode(): Buffer {
    return Buffer.from(serialize(COPTIONSCHEMA, this));
  }
  /**
   * Safe deserializes a borsh serialized buffer to a COption
   * @param {Buffer} data - Buffer containing borsh serialized data
   * @returns {COption} COption object
   */
  static decode(data: any): COption {
    return deserialize(COPTIONSCHEMA, this, data);
  }

  /**
   * Unsafe deserializes a borsh serialized buffer to a COption
   * @param {Buffer} data - Buffer containing borsh serialized data
   * @returns {COption} COption object
   */
  static decodeUnchecked(data: any): COption {
    return deserializeUnchecked(COPTIONSCHEMA, this, data);
  }
}

/**
 * Defines the layout of the COption object
 * for serializing/deserializing
 * @type {Map}
 */
const COPTIONSCHEMA = new Map([
  [
    COption,
    {
      kind: "struct",
      fields: [
        ["noneOrSome", "u32"],
        ["pubKeyBuffer", [32]],
      ],
    },
  ],
]);



type Data = {
  collectors: string[]
}

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
  const maxDepthSizePair: ValidDepthSizePair = {
    // max=8 nodes
    maxDepth: 3,
    maxBufferSize: 8,

    // max=16,384 nodes
    // maxDepth: 14,
    // maxBufferSize: 64,

    // max=131,072 nodes
    // maxDepth: 17,
    // maxBufferSize: 64,

    // max=1,048,576 nodes
    // maxDepth: 20,
    // maxBufferSize: 256,

    // max=1,073,741,824 nodes
    // maxDepth: 30,
    // maxBufferSize: 2048,
  };
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



  /*
    Create the actual NFT collection (using the normal Metaplex method)
    (nothing special about compression here)
  */

  // define the metadata to be used for creating the NFT collection
  const collectionMetadataV3: CreateMetadataAccountArgsV3 = {
    data: {
      name: "xNFT Demo ",
      symbol: "xnftd",
      // specific json metadata for the collection
      uri: "https://supersweetcollection.notarealurl/collection.json",
      sellerFeeBasisPoints: 100,
      creators: [
        {
          address: payer.publicKey,
          verified: false,
          share: 100,
        },
      ],
      collection: null,
      uses: null,
    },
    isMutable: false,
    collectionDetails: null,
  };

  // create a full token mint and initialize the collection (with the `payer` as the authority)
  const collection = await createCollection(connection, payer, collectionMetadataV3);

  /*
    Mint a single compressed NFT
  */

  const coption = COption.fromPublicKey(collection.metadataAccount);
  const compressedNFTMetadata: MetadataArgs = {
    sellerFeeBasisPoints: 0,
    name: "xNFT Demo",
    symbol: collectionMetadataV3.data.symbol,

    // specific json metadata for each NFT
    uri: "https://bafkreibme6bqku67yz6rn3shjjvipiqkmzmc75rb7tj5zebuiyyiiyh6gu.ipfs.nftstorage.link",
    creators: [
      {
        address: payer.publicKey,
        verified: false,
        share: 100,
      }
    ],
    // key: 6,
    // mint: collection.mint,
    // collectionDetails: coption,
    // programmableConfig: ,
    tokenProgramVersion: TokenProgramVersion.Original,
    // updateAuthority: payer.publicKey,
    editionNonce: 0,
    uses: null,
    collection: null,
    primarySaleHappened: false,
    isMutable: false,
    // these values are taken from the Bubblegum package
    // tokenProgramVersion: TokenProgramVersion.Original,
    //@ts-ignore
    tokenStandard: TokenStandard.NonFungible,
  };

  // fully mint a single compressed NFT to the payer
  for (var i = 0; i < 8; i++) {
    console.log(`Minting a single compressed NFT to ${payer.publicKey.toBase58()}...`);
    await mintCompressedNFT(
      connection,
      payer,
      treeKeypair.publicKey,
      collection.mint,
      collection.metadataAccount,
      collection.masterEditionAccount,
      compressedNFTMetadata,
      // mint to this specific wallet (in this case, the tree owner aka `payer`)
      payer.publicKey,
    );
  }
  // // fully mint a single compressed NFT
  // console.log(`Minting a single compressed NFT to ${payer.publicKey.toBase58()}...`);

  // await mintCompressedNFT(
  //   connection,
  //   payer,
  //   treeKeypair.publicKey,
  //   collection.mint,
  //   collection.metadataAccount,
  //   collection.masterEditionAccount,
  //   compressedNFTMetadata,
  //   // mint to this specific wallet (in this case, airdrop to `testWallet`)
  //   testWallet.publicKey,
  // );

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // fetch the payer's final balance
  let balance = await connection.getBalance(payer.publicKey);

  console.log(`===============================`);
  console.log(
    "Total cost:",
    numberFormatter((initBalance - balance) / LAMPORTS_PER_SOL, true),
    "SOL\n",
  );




  res.status(200).json({ collectors: [] })
}
