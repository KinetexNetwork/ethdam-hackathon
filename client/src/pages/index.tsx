import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router';

import { Box } from '@mui/material';

import { Navbar } from 'components/Navbar';

import { csx } from 'helpers/sx';

import { useInWidth } from 'logic/layout';

import { HIDDEN_SCROLLBAR_SX, Y_ONLY_SCROLLBAR_SX } from 'theme/scrollbar';

import { Create } from './Create';
import { Discover } from './Discover';
import { Fill } from './Fill';

export const Index: FC = () => {
  const compactPadding = useInWidth(600);

  return (
    <Box sx={csx({ width: '100vw', height: '100vh' }, Y_ONLY_SCROLLBAR_SX, HIDDEN_SCROLLBAR_SX)}>
      <Navbar />

      <Box
        px={2}
        py={4}
      >
        <Routes>
          <Route
            path='/discover'
            element={<Discover />}
          />

          <Route
            path='/create'
            element={<Create />}
          />

          <Route
            path='/discover/*'
            element={<Fill />}
          />

          <Route
            path='*'
            element={
              <Navigate
                to='/discover'
                replace
              />
            }
          />
        </Routes>
      </Box>
    </Box>
  );
};
