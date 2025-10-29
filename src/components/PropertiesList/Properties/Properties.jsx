import { List } from "@mui/material";
import { PropertyItem } from "../PropertyItem";

function Properties({ items }) {
  return (
    <List>
      {items.map((item) => (
        <PropertyItem key={item.id} item={item} />
      ))}
    </List>
  );
}

export { Properties };
