import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { parseEther } from "ethers";
import hre from "hardhat";

const PRICE = parseEther("0.025");

describe("NFTMarket", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const NFTMarketContract = await hre.ethers.getContractFactory("NTFMarket");
    const NFTCollectionContract = await hre.ethers.getContractFactory(
      "NFTCollection"
    );
    const NFTMarket = await NFTMarketContract.deploy();
    const NFTCollection = await NFTCollectionContract.deploy(
      await NFTMarket.getAddress()
    );

    return { NFTMarket, owner, otherAccount, NFTCollection };
  }

  it("Should deploy the contract", async function () {
    const { NFTMarket } = await loadFixture(deployFixture);
    expect(await NFTMarket.getAddress()).to.be.properAddress;
  });

  it("Sould create market item", async function () {
    const { NFTMarket, NFTCollection, otherAccount } = await loadFixture(
      deployFixture
    );
    const instaceMarket = NFTMarket.connect(otherAccount);
    const instaceCollection = NFTCollection.connect(otherAccount);
    await NFTCollection.mint("uri");
    await instaceCollection.mint("uri2");
    await instaceMarket.createMarketItem(
      await NFTCollection.getAddress(),
      2,
      100,
      {
        value: PRICE,
      }
    );
    await NFTMarket.createMarketItem(await NFTCollection.getAddress(), 1, 100, {
      value: PRICE,
    });
    const item = await NFTMarket.fetchItemsCreated();
    expect(item.length).to.equal(1);
    expect(item[0][5]).to.equal(100);
  });
  it("Should fetch my NFTs", async function () {
    const { NFTMarket, NFTCollection, otherAccount } = await loadFixture(
      deployFixture
    );
    await NFTCollection.mint("uri1");
    await NFTCollection.mint("uri2");
    await NFTMarket.createMarketItem(await NFTCollection.getAddress(), 1, 100, {
      value: PRICE,
    });
    await NFTMarket.createMarketItem(await NFTCollection.getAddress(), 2, 200, {
      value: PRICE,
    });
    const instance = NFTMarket.connect(otherAccount);
    await instance.createMarketSale(await NFTCollection.getAddress(), 2, {
      value: 200,
    });

    const items = await instance.fetchMyNTFs();
    const totlaItems = await NFTMarket.fetchMarketItems();

    expect(items.length).to.equal(1);
    expect(items[0][5]).to.equal(200);
    expect(totlaItems.length).to.equal(1);
  });

  it("Should my created items", async function () {
    const { NFTMarket, NFTCollection } = await loadFixture(deployFixture);
    await NFTCollection.mint("uri1");
    await NFTCollection.mint("uri2");
    await NFTMarket.createMarketItem(await NFTCollection.getAddress(), 1, 100, {
      value: PRICE,
    });
    await NFTMarket.createMarketItem(await NFTCollection.getAddress(), 2, 200, {
      value: PRICE,
    });
    const items = await NFTMarket.fetchItemsCreated();
    expect(items.length).to.equal(2);
    expect(items[0][5]).to.equal(100);
    expect(items[1][5]).to.equal(200);
  });

  it("Should create market sale", async function () {
    const { NFTMarket, NFTCollection, otherAccount } = await loadFixture(
      deployFixture
    );
    const instance = NFTMarket.connect(otherAccount);
    await NFTCollection.mint("uri");
    await NFTMarket.createMarketItem(await NFTCollection.getAddress(), 1, 100, {
      value: PRICE,
    });
    await instance.createMarketSale(await NFTCollection.getAddress(), 1, {
      value: 100,
    });
    const items = await NFTMarket.fetchMarketItems();
    expect(items.length).to.equal(0);
  });

  it("Should NOT create market sale Item not found", async function () {
    const { NFTMarket, NFTCollection, otherAccount } = await loadFixture(
      deployFixture
    );
    const instance = NFTMarket.connect(otherAccount);
    await NFTCollection.mint("uri");
    await NFTMarket.createMarketItem(await NFTCollection.getAddress(), 1, 100, {
      value: PRICE,
    });
    await expect(
      instance.createMarketSale(await NFTCollection.getAddress(), 2, {
        value: 100,
      })
    ).to.be.revertedWith("Item not found");
  });
  it("Should NOT create market sale Item is already sold", async function () {
    const { NFTMarket, NFTCollection, otherAccount } = await loadFixture(
      deployFixture
    );
    const instance = NFTMarket.connect(otherAccount);
    await NFTCollection.mint("uri");
    await NFTMarket.createMarketItem(await NFTCollection.getAddress(), 1, 100, {
      value: PRICE,
    });
    await instance.createMarketSale(await NFTCollection.getAddress(), 1, {
      value: 100,
    });
    await expect(
      instance.createMarketSale(await NFTCollection.getAddress(), 1, {
        value: 100,
      })
    ).to.be.revertedWith("Item is already sold");
  });
  it("Should NOT create market sale Price must be equal to item price", async function () {
    const { NFTMarket, NFTCollection, otherAccount } = await loadFixture(
      deployFixture
    );
    const instance = NFTMarket.connect(otherAccount);
    await NFTCollection.mint("uri");
    await NFTMarket.createMarketItem(await NFTCollection.getAddress(), 1, 100, {
      value: PRICE,
    });
    await expect(
      instance.createMarketSale(await NFTCollection.getAddress(), 1, {
        value: 200,
      })
    ).to.be.revertedWith("Price must be equal to item price");
  });

  it("Should NOT create market item Price must be equal to listingPrice", async function () {
    const { NFTMarket, NFTCollection } = await loadFixture(deployFixture);
    await NFTCollection.mint("uri");
    await expect(
      NFTMarket.createMarketItem(await NFTCollection.getAddress(), 1, 200, {
        value: 10,
      })
    ).to.be.revertedWith("Price must be equal to listingPrice");
  });
});
