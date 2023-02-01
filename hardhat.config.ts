import * as dotenv from "dotenv";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-contract-sizer";

dotenv.config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  
  networks: {
    
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    
    avax:{
      url: process.env.AVAX_MAIN_HTTP || "",
      gasPrice: 225000000000,
      chainId: 43114,
      accounts:
          process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    
    avaxfuji: {
      url: process.env.AVAX_FUJI_HTTP || "",
      gasPrice: 225000000000,
      chainId: 43113,
      accounts:
          process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  
  gasReporter: {    
    enabled: true,
    showTimeSpent: true,
    gasPrice: 21,
    currency: "USD",
    token: "ETH",
    gasPriceApi : "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice",
  },

  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    //only: [':ERC20$'],
  },
  
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
