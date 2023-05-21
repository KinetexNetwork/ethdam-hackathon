import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { getNetworkConfig } from '../../../networkConfig';
import { getDeployContractData } from '../../utils/deploy';
import { beginTask } from '../../utils/format';
import { operation } from '../../utils/operation';

type ResolverSismoDeployArgs = {
  dry: boolean;
  nonce?: string;
};

export const resolverSismoDeploy = async (
  args: ResolverSismoDeployArgs,
  env: HardhatRuntimeEnvironment,
): Promise<void> => {
  beginTask();

  await operation({
    title: 'Deploy SismoResolver',
    env,
    mode: args.dry ? 'dry-run' : 'run',
    transaction: async () => {
      const data = await getDeployContractData({
        contractName: 'SismoResolver',
        constructorParams: [
          getNetworkConfig(env.network.name).oneInchSettlement,
          process.env.SISMO_APP_ID,
          process.env.SISMO_GROUP_ID
        ],
        env,
      });
      return { data };
    },
    nonce: args.nonce,
  });
};
