import { CardActions, List } from "@mui/material";
import Button from "@mui/material/Button";

import { JumboCard } from "@jumbo/components";
import { JumboDdMenu } from "@jumbo/components/JumboDdMenu";
import { Product } from "./Product";
import { menuItems, productsData } from "./data";
import PropTypes from "prop-types";

const PopularProducts = ({ title, subheader }) => {
  return (
    <JumboCard
      title={title}
      subheader={subheader}
      action={<JumboDdMenu menuItems={menuItems} />}
    >
      <List
        disablePadding
        sx={{
          display: "flex",
          minWidth: 0,
          flexWrap: "wrap",
        }}
      >
        {productsData.map((item, key) => (
          <Product key={key} product={item} />
        ))}
      </List>
      <CardActions>
        <Button variant={"text"} sx={{ mb: 1 }}>
          View all
        </Button>
      </CardActions>
    </JumboCard>
  );
};

export { PopularProducts };

PopularProducts.propTypes = {
  title: PropTypes.node.isRequired,
  subheader: PropTypes.node.isRequired,
};
