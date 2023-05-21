import { TokenStandard } from 'models';
import { FC, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';

import { CryptoInput } from 'components/CryptoInput';

import { useSubmitOrder } from 'logic/hooks/useSubmitOrder';
import {
  auctionDurationSelector,
  erc721ContractAddressSelector,
  fromAmountSelector,
  fromCryptoSelector,
  maxToAmountSelector,
  minToAmountSelector,
  sameCryptoSelector,
  sismoGroupIdSelector,
  toCryptoSelector,
  tokenIdSelector,
} from 'logic/order';

export const Create: FC = () => {
  const [tokenStandard, setTokenStandard] = useState<TokenStandard>(TokenStandard.ERC20);
  const [fromCrypto, setFromCrypto] = useRecoilState(fromCryptoSelector);
  const [fromAmount, setFromAmount] = useRecoilState(fromAmountSelector);
  const [minToAmount, setMinToAmount] = useRecoilState(minToAmountSelector);
  const [maxToAmount, setMaxToAmount] = useRecoilState(maxToAmountSelector);
  const [sismoGroupId, setSismoGroupId] = useRecoilState(sismoGroupIdSelector);
  const [toCrypto, setToCrypto] = useRecoilState(toCryptoSelector);
  const [auctionDuration, setAuctionDuration] = useRecoilState(auctionDurationSelector);
  const [tokenId, setTokenId] = useRecoilState(tokenIdSelector);
  const [contractAddress, setContractAddress] = useRecoilState(erc721ContractAddressSelector);
  const sameCrypto = useRecoilValue(sameCryptoSelector);
  const { submitOrder } = useSubmitOrder();

  return (
    <>
      <Stack
        justifyContent='center'
        alignItems='flex-start'
        margin='0 auto'
        width='fit-content'
        gap={4}
      >
        <Typography variant='h2'>Create an order</Typography>
        <Typography variant='body1'>Form a 1inch Fusion auidence-protected order</Typography>

        <FormControl>
          <InputLabel id='create-order-token-standard'>EIP</InputLabel>
          <Select
            required
            labelId='create-order-token-standard'
            id='reate-order-token-standard'
            value={tokenStandard}
            label='EIP'
            onChange={(evt) => setTokenStandard(evt.target.value as TokenStandard)}
          >
            <MenuItem value={TokenStandard.ERC20}>ERC20</MenuItem>
            <MenuItem value={TokenStandard.ERC721}>ERC721</MenuItem>
          </Select>
        </FormControl>

        <Link href='https://factory.sismo.io/groups-explorer'>Create a sismo group</Link>
        <Stack
          direction='row'
          gap={4}
        >
          <FormControl>
            <TextField
              required
              id='group-id'
              label='Audience'
              value={sismoGroupId}
              onChange={(evt) => setSismoGroupId(evt.target.value)}
            />
            <FormHelperText>Sismo group id</FormHelperText>
          </FormControl>

          <FormControl>
            <TextField
              value={auctionDuration}
              id='auction-duration'
              label='Auction duration'
              type='number'
              onChange={(evt) => setAuctionDuration(parseInt(evt.target.value, 10))}
            />
            <FormHelperText>Auction duration in seconds</FormHelperText>
          </FormControl>
        </Stack>

        <Stack
          direction='row'
          gap={4}
        >
          {tokenStandard === TokenStandard.ERC20 ? (
            <CryptoInput
              id='from-crypto'
              label='You sell'
              crypto={fromCrypto}
              cryptoType='swap-from'
              onCryptoSelect={setFromCrypto}
              amount={fromAmount}
              onAmountChange={setFromAmount}
            />
          ) : (
            <Stack
              justifyContent='space-between'
              gap={2}
            >
              <FormControl>
                <TextField
                  required
                  id='erc721-token-address'
                  label='Collection'
                  value={contractAddress}
                  onChange={(evt) => setContractAddress(evt.target.value)}
                />
                <FormHelperText>ERC721 Token address</FormHelperText>
              </FormControl>

              <FormControl>
                <TextField
                  required
                  id='erc721-token-id'
                  label='Token Id'
                  value={tokenId}
                  type='number'
                  onChange={(evt) => setTokenId(parseInt(evt.target.value, 10))}
                />
                <FormHelperText>ERC721 Token Id</FormHelperText>
              </FormControl>
            </Stack>
          )}

          <CryptoInput
            id='to-crypto'
            label='You receive'
            crypto={toCrypto}
            cryptoType='swap-to'
            onCryptoSelect={setToCrypto}
            showSameCrypto={sameCrypto}
            amount={minToAmount}
            onAmountChange={setMinToAmount}
            maxAmount={maxToAmount}
            onMaxAmountChange={setMaxToAmount}
          />
        </Stack>

        <Button
          variant='contained'
          size='large'
          onClick={submitOrder}
        >
          Submit
        </Button>
      </Stack>
    </>
  );
};
