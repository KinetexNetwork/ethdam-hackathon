import {
  AuctionSalt,
  AuctionSuffix,
  FusionOrder,
  NetworkEnum,
  ZERO_ADDRESS,
  buildOrderData,
  getLimitOrderV3Domain,
} from '@1inch/fusion-sdk';
import { PredicateFactory } from '@1inch/fusion-sdk/limit-order/predicate-factory';
import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import erc721ProxyAbi from 'sources/abis/erc721Proxy.abi.json';
import { getNetworkConfig } from 'sources/networkConfig';
import { erc721ABI, useContract, useSigner } from 'wagmi';

import {
  auctionDurationSelector,
  erc721ContractAddressSelector,
  maxToAmountSelector,
  minToAmountSelector,
  tokenIdSelector,
} from 'logic/order';
import { useWallet } from 'logic/wallet';

export const useSubmitOrder = () => {
  const wallet = useWallet();
  const config = getNetworkConfig('arbitrum');
  const tokenId = useRecoilValue(tokenIdSelector);
  const auctionDuation = useRecoilValue(auctionDurationSelector);
  const erc721ContractAddress = useRecoilValue(erc721ContractAddressSelector);
  const minToAmount = useRecoilValue(minToAmountSelector);
  const maxToAmount = useRecoilValue(maxToAmountSelector);

  const seller = wallet.address;

  const ERC721ProxyContractAddress = config.erc721Proxy;
  //   const KxNFTContractAddress = config.kxNft;

  const { data: signer } = useSigner();
  const ERC721Proxy = useContract({ address: ERC721ProxyContractAddress, abi: erc721ProxyAbi });
  const KxNFT = useContract({ address: erc721ContractAddress, abi: erc721ABI, signerOrProvider: signer! });

  const submitOrder = useCallback(async () => {
    if (!KxNFT || !ERC721Proxy || !seller || !signer) {
      console.log('Contracts not initialized');
      return;
    }

    await KxNFT.approve(ERC721Proxy.address as `0x${string}`, BigNumber.from(tokenId));

    // build fusion order
    const salt = new AuctionSalt({
      duration: auctionDuation!,
      auctionStartTime: Math.round(Date.now() / 1000),
      initialRateBump: 50000,
      bankFee: '0',
    });

    const suffix = new AuctionSuffix({
      points: [],
      whitelist: [],
      publicResolvingDeadline: Math.round(Date.now() / 1000),
    });

    const order = new FusionOrder(
      {
        makerAsset: ERC721ProxyContractAddress!,
        takerAsset: config.USDC!, // USDC
        makingAmount: tokenId!.toString(),
        takingAmount: maxToAmount.v,
        maker: seller,
        allowedSender: config.oneInchSettlement,
      },
      salt,
      suffix,
      {
        makerAssetData:
          '0x' +
          (
            await ERC721Proxy.populateTransaction.func_60iHVgK(seller, ZERO_ADDRESS, 0, tokenId, KxNFT.address)
          ).data?.substring(202),
        predicate: PredicateFactory.timestampBelow(salt.auctionStartTime + salt.duration + 32),
      },
    );

    const orderStruct = order.build();

    // sign order
    const domain = getLimitOrderV3Domain(NetworkEnum.ARBITRUM);
    const typedData = buildOrderData(
      NetworkEnum.ARBITRUM,
      domain.verifyingContract,
      domain.name,
      domain.version,
      orderStruct,
    );

    console.log({ domain, typedData });

    const signature = await wallet.signTypedData({
      chainId: NetworkEnum.ARBITRUM.toString(),
      from: wallet.address,
      data: JSON.stringify({
        domain,
        types: typedData.types,
        message: typedData.message,
      }),
    });

    console.log({ orderStruct, signature });
  }, [tokenId, ERC721Proxy, KxNFT, seller]);

  return { submitOrder };
};
