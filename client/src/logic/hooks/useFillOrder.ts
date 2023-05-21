import { NetworkEnum, SETTLEMENT_CONTRACT_ADDRESS_MAP, Settlement } from '@1inch/fusion-sdk';
import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { getNetworkConfig } from 'sources/networkConfig';
import { erc20ABI, useContract, useSigner } from 'wagmi';

import { maxToAmountSelector } from 'logic/order';
import { useWallet } from 'logic/wallet';

export const useFillOrder = () => {
  const wallet = useWallet();
  const { data: signer } = useSigner();
  const config = getNetworkConfig('arbitrum');
  const takingAmount = useRecoilValue(maxToAmountSelector);

  const USDC = useContract({ address: config.USDC, abi: erc20ABI, signerOrProvider: signer! });

  const fill = useCallback(async () => {
    const ResolverContractAddress = config.resolverContract;

    // encode fusion order
    const settlement = new Settlement({
      settlementContract: SETTLEMENT_CONTRACT_ADDRESS_MAP[NetworkEnum.ARBITRUM],
      resolverContract: ResolverContractAddress!,
    });

    // {
    //     "orderStruct": {
    //         "salt": "45417397700932339305195724301284800611937694030544904002258466693450767061107",
    //         "makerAsset": "0x4a335690D6CeAAfEdF026241b0fcc090914449f6",
    //         "takerAsset": "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
    //         "maker": "0x9b58d0aD3CC84dF8b5313c36cE160df2b9397E35",
    //         "receiver": "0x0000000000000000000000000000000000000000",
    //         "allowedSender": "0x4BC3e539AAa5b18A82F6Cd88dc9Ab0e113C63377",
    //         "makingAmount": "21547",
    //         "takingAmount": "3",
    //         "offsets": "2695994667342774153151519748852660538202014015884352064492513653686336",
    //         "interactions": "0x000000000000000000000000000000000000000000000000000000000000542b000000000000000000000000537581d9e92b4fa13977e673daff3819067463f663592c2b00000000000000000000000000000000000000000000000000000000646aa7ad000c004e206469560d01"
    //     },
    //     "signature": "0xe8e6f0428d2c380d48b1624f1f06ba3fa911d310442a780a651bc5c62057a9316e15cc42f0ec7a24f73e6e7b0d8cbe9b9d3c62a2755baa45f099b5a54559cf461c"
    // }

    const orderStruct = {
      salt: '45417397700932339305195724301284800611937694030544904002258466693450767061107',
      makerAsset: '0x4a335690D6CeAAfEdF026241b0fcc090914449f6',
      takerAsset: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
      maker: '0x9b58d0aD3CC84dF8b5313c36cE160df2b9397E35',
      receiver: '0x0000000000000000000000000000000000000000',
      allowedSender: '0x4BC3e539AAa5b18A82F6Cd88dc9Ab0e113C63377',
      makingAmount: '21547',
      takingAmount: '3',
      offsets: '2695994667342774153151519748852660538202014015884352064492513653686336',
      interactions:
        '0x000000000000000000000000000000000000000000000000000000000000542b000000000000000000000000537581d9e92b4fa13977e673daff3819067463f663592c2b00000000000000000000000000000000000000000000000000000000646aa7ad000c004e206469560d01',
    };

    const signature =
      '0xe8e6f0428d2c380d48b1624f1f06ba3fa911d310442a780a651bc5c62057a9316e15cc42f0ec7a24f73e6e7b0d8cbe9b9d3c62a2755baa45f099b5a54559cf461c';

    console.log(wallet.address);

    const calldata = settlement.encodeSettleOrders(
      [
        {
          //@ts-ignore
          order: orderStruct,
          makingAmount: orderStruct.makingAmount,
          takingAmount: '0',
          thresholdAmount: '1000000000000000000',
          target: wallet.address,
          signature,
        },
      ],
      '0x',
    );

    // check and approve USD from buyer

    await USDC!.approve(config.resolverContract as `0x{string}`, BigNumber.from(takingAmount.v));

    // fill fusion order
    const tx = {
      from: wallet.address,
      chainId: NetworkEnum.ARBITRUM.toString(),
      to: SETTLEMENT_CONTRACT_ADDRESS_MAP[NetworkEnum.ARBITRUM],
      data: calldata,

      // tenderly hack
      gasLimit: 1_000_000,
      gasPrice: 1,
    };

    await wallet.sendTransaction(tx);
  }, []);
  return { fill };
};
