import { HardhatRuntimeEnvironment } from 'hardhat/types';

type KxNFTMintArgs = {
  kxnft: string,
  receiver: string,
  tokenid: number,
  uri: string,
  dry: boolean;
  nonce?: string;
};

export const KxNFTMint = async (
  args: KxNFTMintArgs,
  env: HardhatRuntimeEnvironment,
): Promise<void> => {
    const KxNFT = await env.ethers.getContractAt('KxNFT', args.kxnft);

    console.log(
        await (await KxNFT.safeMint(
            args.receiver,
            args.tokenid,
            args.uri
        )).wait()
    );
}