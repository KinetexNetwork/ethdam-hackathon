import { HardhatUserConfig, task } from 'hardhat/config';
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import '@openzeppelin/hardhat-upgrades';
import "hardhat-gas-reporter"
import "hardhat-abi-exporter"
import 'dotenv/config';

const KX_EMULATION_RPC_URL = process.env.KX_EMULATION_RPC_URL || '';

const EMPTY_PRIVATE_KEY = '0000000000000000000000000000000000000000000000000000000000000000';
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || EMPTY_PRIVATE_KEY;
const SELLER_PRIVATE_KEY = process.env.SELLER_PRIVATE_KEY || EMPTY_PRIVATE_KEY;
const BUYER_PRIVATE_KEY = process.env.BUYER_PRIVATE_KEY || EMPTY_PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1_000_000,
      },
      metadata: {
        appendCBOR: true,
        useLiteralContent: true,
      }
    }
  },
  networks: {
    ethereum: {
      chainId: 1,
      url: KX_EMULATION_RPC_URL,
      accounts: [DEPLOYER_PRIVATE_KEY, SELLER_PRIVATE_KEY, BUYER_PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
  },
  abiExporter: [
    {
      path: './abi/json',
      format: "json",
    }
  ]
};

task('deployer', 'Prints active deployer account info')
  .setAction(async (args, env) => {
    const { deployerInfo } = await import('./scripts/tasks/deployer/info');
    await deployerInfo(args, env);
  });

task('resolver-sismo-deploy', 'Deploy Sismo Resolver')
  .addFlag('dry', 'Perform a dry run (estimate only)')
  .addOptionalParam('nonce', 'Nonce override')
  .setAction(async (args, env) => {
    const { resolverSismoDeploy } = await import('./scripts/tasks/resolvers/sismo/deploy');
    await resolverSismoDeploy(args, env);
  });

task('helpers-erc721proxy-deploy', 'Deploy ERC721Proxy helper')
  .addFlag('dry', 'Perform a dry run (estimate only)')
  .addOptionalParam('nonce', 'Nonce override')
  .setAction(async (args, env) => {
    const { ERC721ProxyDeploy } = await import('./scripts/tasks/helpers/deployERC721Proxy');
    await ERC721ProxyDeploy(args, env);
  });

task('test-kxnft-deploy', 'Deploy KxNFT')
  .addFlag('dry', 'Perform a dry run (estimate only)')
  .addOptionalParam('nonce', 'Nonce override')
  .setAction(async (args, env) => {
    const { KxNFTDeploy } = await import('./scripts/tasks/nft/deployKxNFT');
    await KxNFTDeploy(args, env);
  });

task('test-kxnft-mint', 'Mint KxNFT')
  .addParam('kxnft', 'KxNFT Contract Address')
  .addParam('receiver', 'NFT Receiver')
  .addParam('tokenid', 'NFT Token Id')
  .addParam('uri', 'NFT URI')
  .addFlag('dry', 'Perform a dry run (estimate only)')
  .addOptionalParam('nonce', 'Nonce override')
  .setAction(async (args, env) => {
    const { KxNFTMint } = await import('./scripts/tasks/nft/mintKxNFT');
    await KxNFTMint(args, env);
  });

export default config;