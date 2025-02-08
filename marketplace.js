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
