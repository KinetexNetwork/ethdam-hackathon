type NetworkConstants = {
  name: string;
  chainId: number;
  oneInchSettlement?: string;
  oneInchRouter?: string;
  USDC?: string;
  erc721Proxy?: string;
  kxNft?: string;
  resolverContract?: string;
};

interface NetworkConstantsConfig {
  [networkName: string]: NetworkConstants | undefined;
}

const networkConfig: NetworkConstantsConfig = {
  kx: {
    name: 'kx',
    chainId: 1,
    oneInchSettlement: '0xa88800cd213da5ae406ce248380802bd53b47647',
    oneInchRouter: '0x1111111254eeb25477b68fb85ed929f73a960582',
    USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    erc721Proxy: '0x52d015a94A07C1290fFEFfb3608E327aFd6fA7Ab',
    kxNft: '0xe00b1b8Dcd3F93F3c4C0Af7701A0dDA3C6b89C16',
    resolverContract: '0xc4071D02e24baff199c09de4e0E76B1dACA15c18',
  },
  ethereum: {
    name: 'ethereum',
    chainId: 1,
    oneInchSettlement: '0xa88800cd213da5ae406ce248380802bd53b47647',
    oneInchRouter: '0x1111111254eeb25477b68fb85ed929f73a960582',
    USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
  arbitrum: {
    name: 'arbitrum',
    chainId: 42161,
    oneInchRouter: '0x1111111254eeb25477b68fb85ed929f73a960582',
    oneInchSettlement: '0x4BC3e539AAa5b18A82F6Cd88dc9Ab0e113C63377',
    USDC: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
    kxNft: '0x2FA26894a343853fD9F206a182F9aec4fCFd7BA1',
    erc721Proxy: '0x4a335690D6CeAAfEdF026241b0fcc090914449f6',
    resolverContract: '0xc9AAAb0A0E8F84D07C3Afb555D4dbC2E3286b451',
  },
};

export const getNetworkConfig = (network: string): NetworkConstants => {
  const params = networkConfig[network];
  if (!params) {
    throw new Error(`No params specified for the "${network}" network`);
  }

  return params;
};
