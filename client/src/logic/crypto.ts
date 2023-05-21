import { Crypto } from 'models';
import { CRYPTOS, CRYPTOS_SWAP_ALWAYS, CRYPTOS_SWAP_ONLY_FROM, CRYPTOS_SWAP_ONLY_TO } from 'models/constants';
import { useCallback, useMemo } from 'react';

export type CryptoType = 'swap-from' | 'swap-to';

type CryptosParams = {
  type?: CryptoType;
};

const canSwapFrom = (crypto: Crypto): boolean => {
  return CRYPTOS_SWAP_ALWAYS.has(crypto) || CRYPTOS_SWAP_ONLY_FROM.has(crypto);
};

const canSwapTo = (crypto: Crypto): boolean => {
  return CRYPTOS_SWAP_ALWAYS.has(crypto) || CRYPTOS_SWAP_ONLY_TO.has(crypto);
};

export const useCryptos = (params?: CryptosParams): Crypto[] => {
  const { type } = params ?? {};

  const cryptos = useMemo(() => {
    switch (type) {
      case 'swap-from':
        return CRYPTOS.filter(canSwapFrom);
      case 'swap-to':
        return CRYPTOS.filter(canSwapTo);
      default:
        return CRYPTOS;
    }
  }, [type]);

  return cryptos;
};

export type CryptoGetter = (cryptoId: string) => Crypto | undefined;

export const useGetCrypto = (params?: CryptosParams): CryptoGetter => {
  const cryptos = useCryptos(params);
  const cryptoMap = useMemo(() => new Map(cryptos.map((crypto) => [crypto.id, crypto])), [cryptos]);
  const getCrypto: CryptoGetter = useCallback((cryptoId) => cryptoMap.get(cryptoId), [cryptoMap]);
  return getCrypto;
};
