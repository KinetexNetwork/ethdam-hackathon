import { Crypto } from 'models';
import { FC } from 'react';

import { BaseCryptoIcon, DEFAULT_SIZE } from 'components/BaseCryptoIcon';

type Props = {
  crypto?: Crypto;
  size?: number;
};

export const CryptoIcon: FC<Props> = ({ crypto, size = DEFAULT_SIZE }) => {
  const description = `${crypto?.name ?? 'Empty'} crypto icon`;

  return (
    <BaseCryptoIcon
      icon={crypto?.icon}
      size={size}
      description={description}
    />
  );
};
