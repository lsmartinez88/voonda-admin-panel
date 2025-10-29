import { Div } from '@jumbo/shared';
import { Stack, Typography } from '@mui/material';

import { SettingOptionsWithGroup } from '../SettingOptionsWithGroup';

const SettingHeader = ({ title, action, sx = {} }) => {
  return (
    <Div sx={{ borderBottom: 1, borderColor: 'divider', py: 1, mb: 3, ...sx }}>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <>
          <Div sx={{ display: { lg: 'none' } }}>
            <SettingOptionsWithGroup />
          </Div>
          <Div sx={{ display: { xs: 'none', lg: 'block' } }}>
            {typeof title === 'string' ? (
              <Typography variant='h3' sx={{ my: 1 }}>
                {title}
              </Typography>
            ) : (
              title
            )}
          </Div>
        </>
        {action && action}
      </Stack>
    </Div>
  );
};
export { SettingHeader };
