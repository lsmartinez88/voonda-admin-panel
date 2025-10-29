import { Div } from '@jumbo/shared';
import { Card, CardContent, Typography } from '@mui/material';

const InvoiceCard = ({ title, description, icon }) => {
  return (
    <Card>
      <CardContent sx={{ textAlign: 'center' }}>
        <Div sx={{ my: 2 }}>{icon && icon}</Div>
        <Typography variant='h2' fontWeight={500} component={'div'}>
          {title}
        </Typography>
        <Typography variant='body1' color={'text.secondary'} mb={2}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export { InvoiceCard };
