import {
  AuthType,
  SismoConnectButton,
  SismoConnectClientConfig,
  SismoConnectResponse,
} from '@sismo-core/sismo-connect-react';
import { TokenStandard } from 'models';
import { FC, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';

import { CryptoInput } from 'components/CryptoInput';

import { useFillOrder } from 'logic/hooks/useFillOrder';
import {
  auctionDurationSelector,
  fromAmountSelector,
  fromCryptoSelector,
  maxToAmountSelector,
  minToAmountSelector,
  sameCryptoSelector,
  sismoGroupIdSelector,
  toCryptoSelector,
} from 'logic/order';

export const Fill: FC = () => {
  const [tokenStandard, setTokenStandard] = useState<TokenStandard>(TokenStandard.ERC20);
  const [fromCrypto, setFromCrypto] = useRecoilState(fromCryptoSelector);
  const [fromAmount, setFromAmount] = useRecoilState(fromAmountSelector);
  const [minToAmount, setMinToAmount] = useRecoilState(minToAmountSelector);
  const [maxToAmount, setMaxToAmount] = useRecoilState(maxToAmountSelector);
  const [sismoGroupId, setSismoGroupId] = useRecoilState(sismoGroupIdSelector);
  const [toCrypto, setToCrypto] = useRecoilState(toCryptoSelector);
  const [auctionDuration, setAuctionDuration] = useRecoilState(auctionDurationSelector);

  const sameCrypto = useRecoilValue(sameCryptoSelector);

  const config: SismoConnectClientConfig = {
    appId: '0x938ed37c644bbd9313e98cc87f40df21'
  };

  const groupId = '0x37a0c6dca70ff60654675e604b258a48';

  const { fill } = useFillOrder();

  return (
    <>
      <Stack
        justifyContent='center'
        alignItems='flex-start'
        margin='0 auto'
        width='fit-content'
        gap={4}
      >
        <Typography variant='h2'>Fill an order</Typography>

        <CryptoInput
          id='from-crypto'
          label='You are buying'
          crypto={fromCrypto}
          cryptoType='swap-from'
          amount={fromAmount}
          onAmountChange={setFromAmount}
          onCryptoSelect={setToCrypto}
          readonly
        />

        <Typography variant='h3'>Prove you're eligible</Typography>
        <Stack
          justifyContent='center'
          alignItems='center'
        >
          <SismoConnectButton
            //Request proofs for this groupId
            claim={{
              groupId,
            }}
            config={config}
            onResponse={async (response: SismoConnectResponse) => {
              console.log({ response });
              //Send the response to your server to verify it
              //thanks to the @sismo-core/sismo-connect-server package
            }}
            onResponseBytes={async (bytes: string) => {
              console.log({ bytes });
              //Send the response to your contract to verify it
              //thanks to the @sismo-core/sismo-connect-solidity package
            }}
          />
        </Stack>

        <Stack
          direction='row'
          gap={4}
        >
          <CryptoInput
            id='from-crypto'
            label='Your bid'
            crypto={toCrypto}
            cryptoType='swap-to'
            amount={maxToAmount}
            onAmountChange={setMaxToAmount}
            onCryptoSelect={setToCrypto}
          />
        </Stack>

        <Button
          variant='contained'
          size='large'
          onClick={fill}
        >
          Fill
        </Button>
      </Stack>
    </>
  );
};
