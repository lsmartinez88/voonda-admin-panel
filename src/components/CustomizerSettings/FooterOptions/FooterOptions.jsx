import { useJumboLayout } from "@jumbo/components/JumboLayout/hooks";
import { Div } from "@jumbo/shared";
import { FormControlLabel, Switch } from "@mui/material";
import { CustomizerCard } from "../CustomizerCard";

export const FooterOptions = () => {
  const { footerOptions, setFooterOptions } = useJumboLayout();

  const handleFooterPosition = (event) => {
    setFooterOptions({ fixed: event.target.checked });
  };

  return (
    <CustomizerCard title={"Footer Options"}>
      <Div>
        <FormControlLabel
          control={
            <Switch
              checked={footerOptions.fixed}
              onChange={handleFooterPosition}
              name="footer-fixed"
            />
          }
          label="Footer Fixed"
        />
      </Div>
    </CustomizerCard>
  );
};
