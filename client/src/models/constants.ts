import { cryptoIconS3 } from './cryptoIcon';
import { makeCryptoId } from './cryptoId';
import { Chain, Crypto } from './models';

const ETHEREUM_CHAIN: Chain = {
  id: '1',
  icon: cryptoIconS3('6kaxEc'),
  name: 'Ethereum',
};

const GNOSIS_CHAIN: Chain = {
  id: '100',
  icon: cryptoIconS3('32S2t6'),
  name: 'Gnosis',
};

const POLYGON_CHAIN: Chain = {
  id: '137',
  icon: cryptoIconS3('4sXnDD'),
  name: 'Polygon',
};

const FANTOM_CHAIN: Chain = {
  id: '250',
  icon: cryptoIconS3('2hDV2S'),
  name: 'Fantom',
};

const UNISWAP_ETHEREUM_ADDRESS = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';
const UNISWAP_ETHEREUM_CRYPTO: Crypto = {
  id: makeCryptoId({ address: UNISWAP_ETHEREUM_ADDRESS, chainId: ETHEREUM_CHAIN.id }),
  name: 'Uniswap',
  symbol: 'UNI',
  chain: ETHEREUM_CHAIN,
  icon: cryptoIconS3('3ZqEK4'),
  address: UNISWAP_ETHEREUM_ADDRESS,
  decimals: 18,
  permit: true,
};

const CHAINLINK_GNOSIS_ADDRESS = '0xe2e73a1c69ecf83f464efce6a5be353a37ca09b2';
const CHAINLINK_GNOSIS_CRYPTO: Crypto = {
  id: makeCryptoId({ address: CHAINLINK_GNOSIS_ADDRESS, chainId: GNOSIS_CHAIN.id }),
  name: 'Chainlink',
  symbol: 'LINK',
  chain: GNOSIS_CHAIN,
  icon: cryptoIconS3('SPPmV'),
  address: CHAINLINK_GNOSIS_ADDRESS,
  decimals: 18,
  permit: false,
};

const USDC_GNOSIS_ADDRESS = '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83';
const USDC_GNOSIS_CRYPTO: Crypto = {
  id: makeCryptoId({ address: USDC_GNOSIS_ADDRESS, chainId: GNOSIS_CHAIN.id }),
  name: 'USD Coin',
  symbol: 'USDC',
  chain: GNOSIS_CHAIN,
  icon: cryptoIconS3('4syfEa'),
  address: USDC_GNOSIS_ADDRESS,
  decimals: 6,
  permit: false,
};

const USDC_POLYGON_ADDRESS = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';
const USDC_POLYGON_CRYPTO: Crypto = {
  id: makeCryptoId({ address: USDC_POLYGON_ADDRESS, chainId: POLYGON_CHAIN.id }),
  name: 'USD Coin',
  symbol: 'USDC',
  chain: POLYGON_CHAIN,
  icon: cryptoIconS3('4syfEa'),
  address: USDC_POLYGON_ADDRESS,
  decimals: 6,
  permit: true,
};

const DAI_FANTOM_ADDRESS = '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e';
const DAI_FANTOM_CRYPTO: Crypto = {
  id: makeCryptoId({ address: DAI_FANTOM_ADDRESS, chainId: FANTOM_CHAIN.id }),
  name: 'Dai',
  symbol: 'DAI',
  chain: FANTOM_CHAIN,
  icon: cryptoIconS3('5VbaJA'),
  address: DAI_FANTOM_ADDRESS,
  decimals: 18,
  permit: true,
};

export const CRYPTOS: Crypto[] = [
  USDC_GNOSIS_CRYPTO,
  DAI_FANTOM_CRYPTO,
  USDC_POLYGON_CRYPTO,
  CHAINLINK_GNOSIS_CRYPTO,
  UNISWAP_ETHEREUM_CRYPTO,
];

export const CRYPTOS_SWAP_ALWAYS: Set<Crypto> = new Set([USDC_GNOSIS_CRYPTO, DAI_FANTOM_CRYPTO]);

export const CRYPTOS_SWAP_ONLY_FROM: Set<Crypto> = new Set([]);

export const CRYPTOS_SWAP_ONLY_TO: Set<Crypto> = new Set([]);
