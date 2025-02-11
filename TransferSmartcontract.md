//! Odyssey In-Game Item Transfer Smart Contract
//! This Solana smart contract enables secure, on-chain transfers of in-game items between players.

use anchor_lang::prelude::*;

#[program]
pub mod odyssey_item_transfer {
    use super::*;

    pub fn transfer_item(ctx: Context<TransferItem>, item_id: String) -> Result<()> {
        let sender = &ctx.accounts.sender;
        let receiver = &ctx.accounts.receiver;
        
        // Ensure sender owns the item
        require!(sender.items.contains(&item_id), OdysseyError::ItemNotOwned);
        
        // Remove item from sender and add to receiver
        let item_index = sender.items.iter().position(|x| x == &item_id).unwrap();
        sender.items.remove(item_index);
        receiver.items.push(item_id);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct TransferItem<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,
    #[account(mut)]
    pub receiver: Account<'info, Player>,
}

#[account]
pub struct Player {
    pub items: Vec<String>,
}

#[error_code]
pub enum OdysseyError {
    #[msg("Sender does not own the specified item.")]
    ItemNotOwned,
} 
