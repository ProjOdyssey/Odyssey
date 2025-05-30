const express = require('express');
const { PublicKey, Transaction } = require('@solana/web3.js');
const { getItemDetails, createTransaction } = require('./solanaUtils'); 

const router = express.Router();

// Mock database for marketplace items
let marketplaceItems = [
  { id: 1, name: 'Sword of Destiny', price: 10, owner: 'user1' },
  { id: 2, name: 'Shield of Valor', price: 15, owner: 'user2' },
  { id: 3, name: 'Elven Bow', price: 20, owner: 'user3' }
];

// Get all marketplace items
router.get('/items', (req, res) => {
  res.json(marketplaceItems);
});

// Get details of a specific item
router.get('/item/:id', (req, res) => {
  const item = marketplaceItems.find(item => item.id === parseInt(req.params.id));
  if (item) {
    res.json(item);
  } else {
    res.status(404).send('Item not found');
  }
});

// Buy an item
router.post('/buy', async (req, res) => {
  const { itemId, buyerPublicKey } = req.body;
  const item = marketplaceItems.find(item => item.id === itemId);
  
  if (!item) {
    return res.status(404).send('Item not found');
  }

  // Create transaction using Solana
  try {
    const transaction = await createTransaction(buyerPublicKey, item.price, item.owner);
    // Execute the transaction (add actual transaction code here)
    
    // Simulate transaction success and transfer item
    item.owner = buyerPublicKey;
    
    res.json({
      success: true,
      transactionId: transaction.signature,
      newOwner: buyerPublicKey
    });
  } catch (error) {
    res.status(500).send('Transaction failed');
  }
});

module.exports = router;

// marketplace ui

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Marketplace.css'; // Optional CSS for styling

function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch items from the backend API
    axios.get('/api/marketplace/items')
      .then(response => {
        setItems(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching marketplace items:', error);
        setLoading(false);
      });
  }, []);

  const handleBuy = (itemId) => {
    // Replace with the actual buyer's public key
    const buyerPublicKey = 'your-public-key-here';

    axios.post('/api/marketplace/buy', { itemId, buyerPublicKey })
      .then(response => {
        alert(`Transaction successful! You have purchased ${response.data.newOwner}`);
      })
      .catch(error => {
        alert('Failed to complete transaction. Please try again.');
      });
  };

  if (loading) {
    return <div>Loading marketplace...</div>;
  }

  return (
    <div className="marketplace-container">
      <h1>Marketplace</h1>
      <div className="marketplace-grid">
        {items.map(item => (
          <div key={item.id} className="marketplace-item">
            <img
              src={`https://example.com/images/${item.name}.png`} // Replace with actual image URLs
              alt={item.name}
              className="marketplace-item-image"
            />
            <h3>{item.name}</h3>
            <p>Price: {item.price} SOL</p>
            <button onClick={() => handleBuy(item.id)}>Buy</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marketplace;

//! Odyssey NFT Marketplace Smart Contract
//! This Solana smart contract allows users to list, buy, and sell NFTs securely on-chain.

use anchor_lang::prelude::*;

#[program]
pub mod odyssey_nft_marketplace {
    use super::*;

    pub fn list_nft(ctx: Context<ListNFT>, price: u64) -> Result<()> {
        let nft = &mut ctx.accounts.nft;
        nft.owner = *ctx.accounts.owner.key;
        nft.price = price;
        nft.is_listed = true;
        Ok(())
    }

    pub fn buy_nft(ctx: Context<BuyNFT>) -> Result<()> {
        let nft = &mut ctx.accounts.nft;
        let buyer = &ctx.accounts.buyer;
        let seller = &ctx.accounts.seller;
        
        require!(nft.is_listed, OdysseyError::NFTNotListed);
        require!(buyer.lamports() >= nft.price, OdysseyError::InsufficientFunds);

        **seller.to_account_info().try_borrow_mut_lamports()? += nft.price;
        **buyer.to_account_info().try_borrow_mut_lamports()? -= nft.price;
        nft.owner = *buyer.key;
        nft.is_listed = false;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct ListNFT<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(init, payer = owner, space = 8 + 40)]
    pub nft: Account<'info, NFT>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyNFT<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(mut)]
    pub seller: AccountInfo<'info>,
    #[account(mut)]
    pub nft: Account<'info, NFT>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NFT {
    pub owner: Pubkey,
    pub price: u64,
    pub is_listed: bool,
}

#[error_code]
pub enum OdysseyError {
    #[msg("NFT is not listed for sale.")]
    NFTNotListed,
    #[msg("Buyer has insufficient funds.")]
    InsufficientFunds,
}
