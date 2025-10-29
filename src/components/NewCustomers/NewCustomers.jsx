import { JumboCard } from "@jumbo/components";
import { Div } from "@jumbo/shared";
import { Customer } from "./Customer";
import PropTypes from "prop-types";
const NewCustomers = ({ title }) => {
  return (
    <JumboCard title={title} contentWrapper contentSx={{ px: 3, pb: 3, pt: 2 }}>
      <Div sx={{ display: "flex", pb: "2px" }}>
        <Customer />
      </Div>
    </JumboCard>
  );
};

export { NewCustomers };

NewCustomers.propTypes = {
  title: PropTypes.node.isRequired,
};
