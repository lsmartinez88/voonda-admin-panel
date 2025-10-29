
import { JumboCard } from '@jumbo/components';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { Onboarding1Action } from '../Onboarding1Action';
import { PaymentMethods } from '@/components/PaymentMethods';
import { paymentCardData } from '@/components/PaymentMethods/data';

const PersonalDetail = () => {
  return (
    <JumboCard
      title={'Payment Methods'}
      subheader={'Add multiple payment methods you have'}
      action={
        <>
          <Tooltip
            title='Add Payment Method'
            placement='top'
            sx={{ display: { md: 'none' } }}
          >
            <IconButton color='primary' size='small'>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Button
            startIcon={<AddIcon />}
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              textTransform: 'none',
              letterSpacing: 0,
              '&:hover': { background: 'transparent' },
            }}
            disableRipple
          >
            Add Payment Method
          </Button>
        </>
      }
      contentWrapper
      sx={{
        display: 'flex',
        minWidth: 0,
        flexDirection: 'column',
        minHeight: '100%',
      }}
      contentSx={{ flex: 1, pt: 0 }}
    >
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'space-between'}
        height={'100%'}
      >
        <PaymentMethods data={paymentCardData} />
        <Onboarding1Action />
      </Box>
    </JumboCard>
  );
};
export { PersonalDetail };
