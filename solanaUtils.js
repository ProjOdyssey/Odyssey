const { Connection, PublicKey, SystemProgram, Transaction } = require('@solana/web3.js');

// Solana RPC URL
const connection = new Connection('https://api.mainnet-beta.solana.com');

// Create a transaction to buy an item
async function createTransaction(buyerPublicKey, price, sellerPublicKey) {
  const buyer = new PublicKey(buyerPublicKey);
  const seller = new PublicKey(sellerPublicKey);
  
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: buyer,
      toPubkey: seller,
      lamports: price * 1000000000 // Price in lamports (1 SOL = 1,000,000,000 lamports)
    })
  );
  
  const signature = await connection.sendTransaction(transaction, [buyer]);
  await connection.confirmTransaction(signature, 'confirmed');

  return { signature };
}

module.exports = { createTransaction };
