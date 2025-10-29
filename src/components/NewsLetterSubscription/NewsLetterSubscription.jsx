import { isValidEmail } from "@/utilities/helpers";
import { JumboCard } from "@jumbo/components";
import { ErrorOutlineSharp } from "@mui/icons-material";
import { Button, Collapse, TextField, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

export function NewsLetterSubscription({ title, subheader }) {
  const [email, setEmail] = React.useState("");
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = () => {
    if (isValidEmail(email)) {
      setIsEmailValid(true);
      setSubscribed(true);
    } else {
      setIsEmailValid(false);
      setSubscribed(false);
    }
  };
  return (
    <JumboCard
      title={title}
      subheader={subheader}
      contentWrapper
      contentSx={{ pt: 0 }}
    >
      <Collapse in={!subscribed}>
        <TextField
          fullWidth
          required
          label="Email address"
          onChange={(e) => setEmail(e.target.value)}
          error={!isEmailValid}
          helperText={
            isEmailValid ? "" : "Please provide a valid email address."
          }
          InputProps={
            !isEmailValid
              ? {
                endAdornment: (
                  <ErrorOutlineSharp sx={{ color: "error.main" }} />
                ),
              }
              : {}
          }
          sx={{
            mb: 2,
            "& .MuiFormHelperText-root": {
              m: (theme) => theme.spacing(0.5, 0, 2),
            },
          }}
        />
        <Button
          disableElevation
          variant={"contained"}
          onClick={handleSubscribe}
          sx={{ mb: 2.5 }}
        >
          Subscribe
        </Button>
        <Typography
          variant={"body1"}
          color={"text.secondary"}
          sx={{ fontStyle: "italic", fontSize: 12 }}
        >
          Your email is safe with us, we don't spam.
        </Typography>
      </Collapse>
      <Collapse in={subscribed}>
        <Typography variant={"h2"} sx={{ color: "success" }}>
          Thank you for subscribing with us!
        </Typography>
        <Typography variant={"subtitle1"}>
          We will keep you posted with latest news and updates.
        </Typography>
      </Collapse>
    </JumboCard>
  );
}

NewsLetterSubscription.propTypes = {
  title: PropTypes.node.isRequired,
  subheader: PropTypes.node.isRequired,
};
