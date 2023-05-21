import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { getNetworkConfig } from '../../networkConfig';
import { getDeployContractData } from '../utils/deploy';
import { beginTask } from '../utils/format';
import { operation } from '../utils/operation';

type ERC721ProxyDeployArgs = {
  dry: boolean;
  nonce?: string;
};

export const ERC721ProxyDeploy = async (
  args: ERC721ProxyDeployArgs,
  env: HardhatRuntimeEnvironment,
): Promise<void> => {
  beginTask();

  await operation({
    title: 'Deploy ERC721Proxy helper',
    env,
    mode: args.dry ? 'dry-run' : 'run',
    transaction: async () => {
      const data = await getDeployContractData({
        contractName: 'ERC721Proxy',
        constructorParams: [
          getNetworkConfig(env.network.name).oneInchRouter
        ],
        env,
      });
      return { data };
    },
    nonce: args.nonce,
  });
};
