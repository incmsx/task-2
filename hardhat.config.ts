import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY, 
    token: "ETH",
    gasPrice: 50
  }
};

export default config;
