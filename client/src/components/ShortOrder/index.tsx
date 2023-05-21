import { SimplifiedOrder20 } from 'models';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import truncateEthAddress from 'truncate-eth-address';

import { Box, Button, Stack, Typography, css, styled } from '@mui/material';

import { CryptoIcon } from 'components/CryptoIcon';

import { formatCryptoMoney } from 'helpers/amount';

const StyledOrder = styled(Box)(
  ({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(4, max-content);
    align-items: center;
    gap: 10rem;
    justify-content: center;
  `,
);

export const ShortOrder: FC<SimplifiedOrder20> = ({
  seller,
  fromCrypto,
  fromAmount,
  toCrypto,
  minToAmount,
  maxToAmount,
  orderId,
  ...rest
}) => {
  const navigate = useNavigate();

  return (
    <StyledOrder {...rest}>
      <Stack gap={2}>
        <Typography>Seller</Typography>
        <Typography>{truncateEthAddress(seller)}</Typography>
      </Stack>

      <Stack gap={2}>
        <Typography>Sell:</Typography>

        <Stack
          direction='row'
          gap={1}
        >
          <Typography>{formatCryptoMoney(fromAmount)}</Typography>
          <CryptoIcon crypto={fromCrypto} />
        </Stack>
      </Stack>

      <Stack gap={2}>
        <Typography>For:</Typography>

        <Stack
          direction='row'
          gap={1}
        >
          <Typography>{formatCryptoMoney(maxToAmount)}</Typography>
          <CryptoIcon crypto={toCrypto} />
          <Typography>-</Typography>
          <Typography>{formatCryptoMoney(minToAmount)}</Typography>
          <CryptoIcon crypto={toCrypto} />
        </Stack>
      </Stack>

      <Button
        variant='contained'
        onClick={() => navigate(`/discover/${orderId}`)}
      >
        Fill
      </Button>
    </StyledOrder>
  );
};
