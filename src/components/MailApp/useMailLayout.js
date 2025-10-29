import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import React from 'react';

export const useMailLayout = () => {
  const { theme } = useJumboTheme();
  return React.useMemo(
    () => ({
      sidebarOptions: {
        sx: {
          width: 200,
          display: 'flex',
          minWidth: 0,
          flexShrink: 0,
          flexDirection: 'column',
          mr: 3,
          [theme.breakpoints.up('lg')]: {
            position: 'sticky',
            zIndex: 5,
            top: 96,
          },
          [theme.breakpoints.down('lg')]: {
            display: 'none',
          },
        },
      },
      wrapperOptions: {
        sx: {
          alignItems: 'flex-start',
        },
      },
      contentOptions: {
        sx: {
          p: { lg: 0, sm: 0, xs: 0 },
        },
      },
    }),
    [theme]
  );
};
