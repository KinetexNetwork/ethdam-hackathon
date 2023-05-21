export type Amount = {
  v: string;
  d: number;
};

export type Chain = {
  id: string;
  name: string;
  icon: string;
};

export type Crypto = {
  id: string;
  name: string;
  symbol: string;
  address: string;
  chain: Chain;
  icon: string;
  decimals: number;
  permit: boolean;
};

export type Quote = {
  fromCrypto: Crypto;
  fromAmount: Amount;
  toCrypto: Crypto;
  toAmount: Amount;
  collateralCrypto: Crypto;
  collateralAmount: Amount;
  marketMakerAddress: string;
  timeEstimate: number;
  deadline: number;
};

export type SwapTransaction = {
  txid: string;
  explorerUrl: string;
};

export enum SwapState {
  AwaitingSignature = 'awaiting-signature',
  AwaitingTransactions = 'awaiting-transactions',
  CancelledNoWithdraw = 'cancelled-no-withdraw',
  CancelledAwaitingWithdraw = 'cancelled-awaiting-withdraw',
  CancelledWithdrawn = 'cancelled-withdrawn',
  Completed = 'completed',
}

export type Swap = Quote & {
  hash: string;
  state: SwapState;
  orderData: string;
  userToMarketMakerTx?: SwapTransaction;
  marketMakerToUserTx?: SwapTransaction;
};

export type Permit = {
  transaction: string;
  expiresAt: Date;
  chainId: string;
  tokenAddress: string;
  userAddress: string;
  maxAmount?: string;
};

export enum TokenStandard {
  ERC20,
  ERC721,
}

export type SimplifiedOrder20 = {
  seller: string;
  fromCrypto: Crypto;
  fromAmount: Amount;
  toCrypto: Crypto;
  minToAmount: Amount;
  maxToAmount: Amount;
  orderId: string;
};

export type SimplifiedOrder721 = {
  seller: string;
  erc721TokenAddress: string;
  tokenId: string;
  toCrypto: Crypto;
  minToAmount: Amount;
  maxToAmount: Amount;
  orderId: string;
};
