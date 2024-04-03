# NFT Marketplace Project

## Project Overview

This NFT Marketplace project is built on Ethereum and leverages Solidity for the development of two main contracts: `NFTCollection` and `NTFMarket`. The project aims to provide a comprehensive solution for creating, selling, and trading NFTs. It utilizes the ERC-721 standard for the NFTs themselves and provides a marketplace mechanism for listing and purchasing these digital assets.

## Contracts

### NFTCollection

The `NFTCollection` contract allows users to mint their own NFTs by providing a metadata URI. Each NFT is minted with a unique token ID and is automatically approved for all marketplace transactions.

- **Contract Address**: [0xa294D239dCe21720a26cAb5f296dB165980E3403](https://sepolia.etherscan.io/address/0xa294D239dCe21720a26cAb5f296dB165980E3403#code)
- **ERC-721 Standard**: Ensures compatibility with the widely-accepted NFT standard.
- **Mint Function**: Allows the creation of new NFTs with unique identifiers and metadata.

### NTFMarket

The `NTFMarket` contract facilitates the listing, buying, and selling of NFTs within the marketplace. It tracks each item's status, including whether it's sold or still available for purchase.

- **Contract Address**: [0xbA932b4dc5be91698094F4b2ACa3D920603b1a52](https://sepolia.etherscan.io/address/0xbA932b4dc5be91698094F4b2ACa3D920603b1a52#code)
- **ReentrancyGuard**: Provides protection against reentrancy attacks, ensuring secure transactions.
- **Market Functions**: Supports creating market items, executing sales, and retrieving item information.

## Installation

To interact with these contracts or deploy your own instance of the marketplace, you'll need to set up a Hardhat environment:

1. Clone the repository to your local machine.
2. Run `yarn install` to fetch necessary dependencies.
3. Set up your `.env` file to include your Ethereum node provider and private key information.

## Usage

### Compiling Contracts

```shell
npx hardhat compile
```

This will compile both the `NFTCollection` and `NTFMarket` contracts, ensuring they're ready for deployment or local testing.

### Deploying Contracts

```shell
npx hardhat run scripts/deploy.js --network <your-network>
```

Replace `<your-network>` with the name of the network you wish to deploy to (e.g., `rinkeby`, `mainnet`, `sepolia`).

### Interacting with Deployed Contracts

Utilize Hardhat tasks or a script in the `scripts` directory to interact with your deployed contracts. This might include minting NFTs, listing them on the marketplace, or purchasing them.

## Requirements

- Node.js and Yarn
- An Ethereum wallet with ETH for deploying contracts
- Hardhat for smart contract compilation, testing, and deployment

## Contributing

We welcome contributions from the community. To contribute:

1. Fork the repository.
2. Create a new branch for your feature.
3. Commit your changes.
4. Push to the branch and open a pull request.

## License

This project is licensed under the MIT License.
