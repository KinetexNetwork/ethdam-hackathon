import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { getDeployContractData } from '../utils/deploy';
import { beginTask } from '../utils/format';
import { operation } from '../utils/operation';

type KxNFTDeployArgs = {
  dry: boolean;
  nonce?: string;
};

export const KxNFTDeploy = async (
  args: KxNFTDeployArgs,
  env: HardhatRuntimeEnvironment,
): Promise<void> => {
  beginTask();

  await operation({
    title: 'Deploy KxNFT helper',
    env,
    mode: args.dry ? 'dry-run' : 'run',
    transaction: async () => {
      const data = await getDeployContractData({
        contractName: 'KxNFT',
        constructorParams: [],
        env,
      });
      return { data };
    },
    nonce: args.nonce,
  });
};
