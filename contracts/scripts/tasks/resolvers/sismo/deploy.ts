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
    title: 'Deploy NFTResolver',
    env,
    mode: args.dry ? 'dry-run' : 'run',
    transaction: async () => {
      const data = await getDeployContractData({
        contractName: 'NFTResolver',
        constructorParams: [
          getNetworkConfig(env.network.name).oneInchSettlement,
          '0x938ed37c644bbd9313e98cc87f40df21'
        ],
        env,
      });
      return { data };
    },
    nonce: args.nonce,
  });
};
