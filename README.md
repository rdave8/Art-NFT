# Art-NFT

An upgradeable ERC721 implementation and demo.

This project showcases the creation and management of art pieces as NFTs, allowing owners to deploy new art pieces with specified attributes like the number of copies to mint and the price of each token. Each token's URI includes an IPFS metadata JSON file containing details such as name, artist, and a reference to a PNG image. The image itself is stored on IPFS. Users can purchase a piece using USDC. When a piece is purchased, the owner can set its new price or make it not for sale. The contract implements the UUPS Proxy Pattern for upgradability. The second version of the implementation contract adds functionality for the owner to apply an initial 50% discount to a piece before it is sold.

## Running Demo Locally

```
npm install

npx hardhat test
```

## Demo Simulation Steps

1. Generate 3 signer addresses (initialOwner, addrA, addrB)
2. Deploy an ERC20 contract representing USDC with a faucet function
3. Mint USDC into each signer address
4. Deploy V1 implementation contract and proxy
5. Initial owner adds 2 copies of a painting for sale
6. addrA buys one
7. addrB buys the other one
8. Initial owner claims the USDC received by the contract
9. Implementation contract upgraded to V2
10. Initial owner adds a new painting
11. Initial owner applies a 50 percent discount to this painting
12. addrA buys this painting
13. Initial owner claims new USDC from the contract
14. addrB changes the price of the painting it owns
15. addrA buys the painting from addrB