
import AddIcon from "@mui/icons-material/Add";
import { Card, CardActions, CardContent, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid2";
import { BalanceSummary } from "./BalanceSummary";
import PropTypes from "prop-types";
import { ButtonStack } from "@/components/ButtonStack";
import { Progressbar } from "@/components/Progressbar";

const PortfolioBalance = ({ title }) => {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent sx={{ pt: 2 }}>
        <Grid container spacing={3}>
          <Grid size={6}>
            <BalanceSummary
              amount={"$179,626"}
              trend={{ percentage: 13, direction: "up" }}
              label="Overall Balance"
            />
            <ButtonStack>
              <Button variant={"contained"} color={"secondary"}>
                Deposit
              </Button>
              <Button variant={"contained"} color={"inherit"} disableElevation>
                Withdraw
              </Button>
            </ButtonStack>
          </Grid>
          <Grid size={6}>
            <Typography variant={"h5"} color={"text.secondary"} mb={2}>
              Portfolio distribution
            </Typography>
            <Progressbar
              variant={"determinate"}
              color={"success"}
              label="BTC"
              subLabel="8.75"
              value={70}
            />
            <Progressbar
              label="RLP"
              subLabel="4.87"
              variant="determinate"
              color="warning"
              value={40}
              sx={{ mb: 0 }}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ pt: 0.5, pb: 2 }}>
        <Button startIcon={<AddIcon />} size="small">
          Add More
        </Button>
      </CardActions>
    </Card>
  );
};

export { PortfolioBalance };

PortfolioBalance.propTypes = {
  title: PropTypes.node.isRequired,
};
