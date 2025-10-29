import { ASSET_IMAGES } from '@/utilities/constants/paths';
import { Span } from '@jumbo/shared';
import { Typography } from '@mui/material';

export const licenseData = [
  {
    id: 1,
    name: 'Business Analytics',
    profileImage: `${ASSET_IMAGES}/image(2).png`,
    desc: (
      <>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary' }}
          component={'span'}
          display={'block'}
        >
          {'Cornell University'}
        </Typography>
        <Span>{'Issued Jan 2024'}</Span>
      </>
    ),
  },
  {
    id: 2,
    name: 'Quantum Computing',
    profileImage: `${ASSET_IMAGES}/image(1).png`,
    desc: (
      <>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary' }}
          component={'span'}
          display={'block'}
        >
          {'MIT'}
        </Typography>
        <Span>{'Issued 2024'}</Span>
      </>
    ),
  },
];
