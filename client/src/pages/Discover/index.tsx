import { FusionOrder } from '@1inch/fusion-sdk';
import { Amount, Crypto, SimplifiedOrder20, SimplifiedOrder721 } from 'models';
import { CRYPTOS } from 'models/constants';
import { FC, useState } from 'react';

import { Box, Button, Checkbox, FormControl, FormControlLabel, Stack, Typography, css, styled } from '@mui/material';

import { ShortOrder } from 'components/ShortOrder';
import { ShortOrder721 } from 'components/ShortOrder721';

const orders: SimplifiedOrder20[] = [
  {
    seller: '0x9b58d0aD3CC84dF8b5313c36cE160df2b9397E35',
    fromCrypto: CRYPTOS[0],
    fromAmount: { v: '6000000', d: 6 },
    toCrypto: CRYPTOS[1],
    minToAmount: { v: '5800000', d: 6 },
    maxToAmount: { v: '6200000', d: 6 },
    orderId: '1',
  },
  {
    seller: '0x9b58d0aD3CC84dF8b5313c36cE160df2b9397E35',
    fromCrypto: CRYPTOS[1],
    fromAmount: { v: '6000000', d: 6 },
    toCrypto: CRYPTOS[0],
    minToAmount: { v: '5800000', d: 6 },
    maxToAmount: { v: '6200000', d: 6 },
    orderId: '2',
  },
];

const orders721: SimplifiedOrder721[] = [
  {
    seller: '0x9b58d0aD3CC84dF8b5313c36cE160df2b9397E35',
    erc721TokenAddress: '0x537581D9E92B4Fa13977e673daff3819067463f6',
    tokenId: '21547',
    toCrypto: CRYPTOS[1],
    minToAmount: { v: '5800000', d: 6 },
    maxToAmount: { v: '6200000', d: 6 },
    orderId: '3',
  },
  {
    seller: '0x9b58d0aD3CC84dF8b5313c36cE160df2b9397E35',
    erc721TokenAddress: '0x537581D9E92B4Fa13977e673daff3819067463f6',
    tokenId: '21548',
    toCrypto: CRYPTOS[0],
    minToAmount: { v: '5800000', d: 6 },
    maxToAmount: { v: '6200000', d: 6 },
    orderId: '4',
  },
];
export const Discover: FC = () => {
  // const [orders, setOrders] = useState<FusionOrder[]>([]);

  return (
    <>
      <Stack
        justifyContent='center'
        alignItems='flex-start'
        margin='0 auto'
        width='fit-content'
        gap={4}
      >
        <FormControl>
          <FormControlLabel
            control={<Checkbox />}
            label='Show only my orders'
          />
        </FormControl>

        <Typography variant='h2'>Ongoing ERC20 auctions</Typography>

        <Stack gap={8}>
          {orders.map((order, index) => (
            <ShortOrder
              {...order}
              key={`discover-erc20-${index}`}
            />
          ))}
        </Stack>

        <Typography
          variant='h2'
          mt={4}
        >
          Ongoing NFT auctions
        </Typography>

        <Stack gap={8}>
          {orders721.map((order, index) => (
            <ShortOrder721
              {...order}
              key={`discover-erc721-${index}`}
            />
          ))}
        </Stack>
      </Stack>
    </>
  );
};
