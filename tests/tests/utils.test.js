const { connectToSolana } = require('../src/utils/solana'); 
describe('Solana Blockchain Utility', () => {
  it('should connect to Solana blockchain', async () => {
    const connection = await connectToSolana();
    expect(connection).toBeDefined();  // Checks that the connection is established
    expect(connection.rpcEndpoint).toBe('https://api.mainnet-beta.solana.com'); // Example RPC endpoint
  });

  // Add more utility tests as needed
});
