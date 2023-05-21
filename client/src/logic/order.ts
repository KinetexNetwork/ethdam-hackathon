import { Amount, Crypto, TokenStandard } from 'models';
import { atom, selector } from 'recoil';

import { ZERO_AMOUNT } from 'helpers/amount';
import { isNull } from 'helpers/null';
import { Nullable } from 'helpers/types';

const ns = (key: string): string => {
  return `swapParams/${key}`;
};

export const fromCryptoSelector = atom<Nullable<Crypto>>({
  key: ns('fromCryptoSelector'),
  default: undefined,
});

export const tokenIdSelector = atom<Nullable<number>>({
  key: ns('tokenIdSelector'),
  default: undefined,
});

export const erc721ContractAddressSelector = atom<Nullable<string>>({
  key: ns('erc721ContractAddressSelector'),
  default: undefined,
});

export const fromAmountSelector = atom<Amount>({
  key: ns('fromAmountSelector'),
  default: ZERO_AMOUNT,
});

export const minToAmountSelector = atom<Amount>({
  key: ns('minToAmountSelector'),
  default: ZERO_AMOUNT,
});

export const maxToAmountSelector = atom<Amount>({
  key: ns('maxToAmountSelector'),
  default: ZERO_AMOUNT,
});

export const toCryptoSelector = atom<Nullable<Crypto>>({
  key: ns('toCryptoSelector'),
  default: undefined,
});

export const sismoGroupIdSelector = atom<Nullable<string>>({
  key: ns('sismoGroupId'),
  default: undefined,
});

export const tokenStandardSelector = atom<Nullable<TokenStandard>>({
  key: ns('tokenStandard'),
  default: TokenStandard.ERC20,
});

export const auctionDurationSelector = atom<Nullable<number>>({
  key: ns('auctionDuration'),
  default: 86400,
});

export const sameCryptoSelector = selector<boolean>({
  key: ns('sameCryptoSelector'),
  get: ({ get }) => {
    const fromCrypto = get(fromCryptoSelector);
    if (isNull(fromCrypto)) {
      return false;
    }

    const toCrypto = get(toCryptoSelector);
    if (isNull(toCrypto)) {
      return false;
    }

    const sameId = fromCrypto.id === toCrypto.id;
    return sameId;
  },
});
