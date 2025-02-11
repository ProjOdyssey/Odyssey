// Odyssey In-Game Item Transfer - Solana Interaction Script
// This script allows interaction with the smart contract for testing item transfers.

import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
import idl from "./idl.json"; // Import the IDL of the smart contract

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const wallet = Keypair.generate(); // Replace with actual wallet
const provider = new AnchorProvider(connection, wallet, {});
const program = new Program(idl, new PublicKey("Your_Program_ID"), provider);

async function transferItem(sender, receiver, itemId) {
    try {
        const tx = await program.methods.transferItem(itemId)
            .accounts({
                sender: sender.publicKey,
                receiver: receiver,
            })
            .signers([sender])
            .rpc();

        console.log("Transaction successful! Tx ID:", tx);
    } catch (error) {
        console.error("Error transferring item:", error);
    }
}

// Example Usage
(async () => {
    const sender = Keypair.generate(); // Replace with actual sender
    const receiver = new PublicKey("Receiver_Public_Key");
    const itemId = "sword_001";

    await transferItem(sender, receiver, itemId);
})();
