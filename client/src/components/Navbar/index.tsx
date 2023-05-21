import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Create } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Chip,
  Stack,
  Typography,
  css,
  styled,
} from '@mui/material';

import KinetexLogo from 'assets/icons/KinetexLogo';

import { WalletButton } from 'components/WalletButton';

import { useInWidth } from 'logic/layout';

enum Pages {
  DISCOVER = 'Discover',
  CREATE = 'Create',
}

const getRoute = (pageId: number) => Object.values(Pages)[pageId].toLowerCase();

const Grid = styled(Box)(
  ({ theme }) => css`
    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    align-items: center;
    justify-content: center;
  `,
);

export const Navbar: FC = () => {
  const [currentPage, setCurrentPage] = useState<Pages>(Pages.DISCOVER);
  const compact = useInWidth(460);
  const veryCompact = useInWidth(320);
  const navigate = useNavigate();

  return (
    <Stack sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Grid sx={{ p: 2 }}>
          <Stack direction='row'>
            <KinetexLogo fontSize='large' />

            {veryCompact ? null : (
              <Stack
                direction='row'
                gap={1}
                alignItems='center'
                ml={1}
              >
                <Typography
                  variant='h6'
                  component='div'
                  sx={{ flexGrow: 1 }}
                >
                  {compact ? 'k721' : 'Kinetex 721'}
                </Typography>
                <Chip
                  label={compact ? '🚧' : 'Proto 🚧'}
                  color='primary'
                  size='small'
                />
              </Stack>
            )}
          </Stack>

          <BottomNavigation
            showLabels
            value={currentPage}
            onChange={(event, page: Pages) => {
              setCurrentPage(page);

              //@ts-ignore
              navigate(`/${getRoute(page)}`);
            }}
            sx={{ background: 'transparent' }}
          >
            <BottomNavigationAction
              label={Pages.DISCOVER}
              icon={<TravelExploreIcon />}
            />
            <BottomNavigationAction
              label={Pages.CREATE}
              icon={<Create />}
            />
          </BottomNavigation>

          <Stack
            direction='row'
            justifyContent='flex-end'
          >
            <WalletButton />
          </Stack>
        </Grid>
      </AppBar>
    </Stack>
  );
};
