
import { Logo } from '@/components/Logo';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useJumboTheme } from '@jumbo/components/JumboTheme/hooks';
import { Div, Link } from '@jumbo/shared';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {
  Button,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import React from 'react';

const Onboarding1Sidebar = () => {
  const { steps, activeIndex } = useOnboarding();
  const { theme } = useJumboTheme();
  return (
    <Div
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flex: 1,
      }}
    >
      <Div sx={{ mb: 2 }}>
        <Div sx={{ mb: 3 }}>
          <Logo sx={{ mr: 3, minWidth: 150 }} mode={theme.type} />
        </Div>
        <Stepper
          activeStep={activeIndex}
          orientation='vertical'
          sx={{
            '.MuiStepLabel-root': {
              paddingBlock: 0,
              color: (theme) => theme.palette.text.secondary,
            },
            '& .MuiStepLabel-iconContainer': {
              pr: 2,
            },
            '& .MuiStepConnector-root': {
              ml: 2.5,
            },
            '& .MuiStepConnector-line': {
              minHeight: 32,
              borderColor: 'inherit',
            },
            '& .Mui-active, & .MuiStepLabel-label.Mui-active': {
              color: (theme) => theme.palette.primary.main,
            },
            '& .Mui-completed, & .MuiStepLabel-label.Mui-completed': {
              color: (theme) => theme.palette.success.main,
            },
          }}
        >
          {steps.map((item) => (
            <Step key={item.label}>
              <StepLabel
                StepIconComponent={() => (
                  <IconButton
                    sx={{
                      border: 1,
                      borderRadius: 2,
                      color: 'inherit',
                    }}
                  >
                    {item.icon}
                  </IconButton>
                )}
              >
                <React.Fragment>
                  <Typography variant='h5' mb={0.25} color={'inherit'}>
                    {item.label}
                  </Typography>
                  <Typography color={'text.secondary'} variant='body2'>
                    {item.description}
                  </Typography>
                </React.Fragment>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Div>
      <Link href={'/'}>
        <Button
          startIcon={<KeyboardBackspaceIcon />}
          sx={{
            color: (theme) => theme.palette.text.primary,
            '&:hover': { background: 'transparent' },
            textTransform: 'none',
            fontSize: 15,
            letterSpacing: 0,
          }}
          disableRipple
        >
          Back to home
        </Button>
      </Link>
    </Div>
  );
};

export { Onboarding1Sidebar };

