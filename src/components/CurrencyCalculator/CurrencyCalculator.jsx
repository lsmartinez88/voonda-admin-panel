import { JumboCard } from "@jumbo/components";
import { InputLabel, Select, TextField, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";
import React from "react";
import { currencies, currencyRates } from "./data";
import PropTypes from "prop-types";

const CurrencyCalculator = ({ title }) => {
  const [fromCurrency, setFromCurrency] = React.useState(currencies[0]);
  const [toCurrency, setToCurrency] = React.useState(currencies[1]);
  const [conversionRate, setConversionRate] = React.useState(
    currencyRates[`${fromCurrency}-${toCurrency}`]
  );
  const [amount, setAmount] = React.useState(0);
  const [convertedValue, setConvertedValue] = React.useState(0);

  React.useEffect(() => {
    setConversionRate(currencyRates[`${fromCurrency.code}-${toCurrency.code}`]);
  }, [fromCurrency, toCurrency]);

  React.useEffect(() => {
    const convertedAmount = amount * conversionRate;
    setConvertedValue(convertedAmount);
  }, [conversionRate, amount]);

  const changeFromCurrency = (e) => {
    for (let count = 0; count < currencies.length; count++) {
      if (currencies[count].code === e.target.value)
        setFromCurrency(currencies[count]);
    }
  };
  const changeToCurrency = (e) => {
    for (let count = 0; count < currencies.length; count++) {
      if (currencies[count].code === e.target.value)
        setToCurrency(currencies[count]);
    }
  };
  return (
    <JumboCard
      title={title}
      subheader={"05:58 am | March 20, 2024"}
      contentWrapper={true}
      contentSx={{ p: 3 }}
    >
      <Typography
        variant={"h6"}
        color={"text.primary"}
      >{`${amount} ${fromCurrency.name} equals`}</Typography>
      <Typography
        component={"div"}
        variant={"h1"}
      >{`${convertedValue} ${toCurrency.name}`}</Typography>
      <Typography variant={"body1"} color={"text.secondary"} mb={4}>
        {`1 ${fromCurrency.name} @${conversionRate} ${toCurrency.name}`}
      </Typography>
      <Grid container spacing={2} mb={1}>
        <Grid size={6}>
          <FormControl fullWidth>
            <InputLabel id="from">From</InputLabel>
            <Select
              label={"USD"}
              defaultValue={"usd"}
              fullWidth
              onChange={changeFromCurrency}
            >
              {currencies.map((currency, key) => {
                return (
                  <MenuItem key={key} value={currency.code}>
                    {currency.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={6}>
          <FormControl fullWidth>
            <InputLabel id="to">To</InputLabel>
            <Select
              label={"INR"}
              defaultValue={"inr"}
              onChange={changeToCurrency}
            >
              {currencies.map((currency, key) => {
                return (
                  <MenuItem key={key} value={currency.code}>
                    {currency.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={12}>
          <FormControl fullWidth>
            <TextField
              label="Amount"
              placeholder={"Amount"}
              value={amount}
              margin={"dense"}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
          </FormControl>
        </Grid>
      </Grid>
    </JumboCard>
  );
};

export { CurrencyCalculator };

CurrencyCalculator.propTypes = {
  title: PropTypes.node,
};
