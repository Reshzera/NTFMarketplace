import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NTFMarket = buildModule("NTFMarket", (m) => {
  const ntfMarket = m.contract("NTFMarket");
  const ntfCollection = m.contract("NFTCollection", [ntfMarket]);

  return { ntfMarket, ntfCollection };
});

export default NTFMarket;
