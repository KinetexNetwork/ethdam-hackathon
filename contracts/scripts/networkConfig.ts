type NetworkConstants = {
  name: string,
  chainId: number,
  oneInchSettlement: string,
  oneInchRouter: string,
  USDC: string,
}

interface NetworkConstantsConfig {
    [networkName: string]: NetworkConstants | undefined;
}

const networkConfig: NetworkConstantsConfig = require('../config.json');

export const getNetworkConfig = (network: string): NetworkConstants => {
   const params = networkConfig[network];
   if (!params) {
     throw new Error(`No params specified for the "${network}" network`);
   }

   return params;
}