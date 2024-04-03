import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { parseEther } from "ethers";
import hre from "hardhat";

const PRICE = parseEther("0.025");

describe("NFTCollection", function () {
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
    const { NFTCollection } = await loadFixture(deployFixture);
    expect(await NFTCollection.getAddress()).to.be.properAddress;
  });

  it("Should mint item", async function () {
    const { NFTCollection } = await loadFixture(deployFixture);
    await NFTCollection.mint("uri");

    const item = await NFTCollection.tokenURI(1);

    expect(item).to.equal("uri");
  });

  it("Should change approval", async function () {
    const { NFTCollection, otherAccount, owner } = await loadFixture(
      deployFixture
    );
    const instance = NFTCollection.connect(otherAccount);
    await instance.mint("uri");
    await instance.setApprovalForAll(await owner.getAddress(), true);

    expect(
      await instance.isApprovedForAll(
        await otherAccount.getAddress(),
        await owner.getAddress()
      )
    ).to.be.true;
  });

  it("Should NOT change approval", async function () {
    const { NFTCollection, otherAccount, NFTMarket } = await loadFixture(
      deployFixture
    );
    const instance = NFTCollection.connect(otherAccount);
    await instance.mint("uri");

    await expect(
      instance.setApprovalForAll(await NFTMarket.getAddress(), false)
    ).to.be.revertedWith("ERC721: approve to caller that is not owner");
  });

  it("Should supportsInterface", async function () {
    const { NFTCollection } = await loadFixture(deployFixture);

    expect(await NFTCollection.supportsInterface("0x80ac58cd")).to.be.true;
  });
});
