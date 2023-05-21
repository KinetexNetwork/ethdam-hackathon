import { Amount } from 'models';
import { useCallback } from 'react';

const EMPTY_CRYPTO_PRICES = {};

export type CryptoPriceGetter = (cryptoId: string) => Amount | undefined;

export const useGetCryptoPrice = (): CryptoPriceGetter => {
  const cryptoPricesResult = {};

  //@ts-ignore
  const cryptoPrices = cryptoPricesResult?.data?.data?.prices ?? EMPTY_CRYPTO_PRICES;

  const getCryptoPrice = useCallback(
    (cryptoId: string) => {
      const price = cryptoPrices[cryptoId] ?? undefined;
      return price;
    },
    [cryptoPrices],
  );

  return getCryptoPrice;
};
