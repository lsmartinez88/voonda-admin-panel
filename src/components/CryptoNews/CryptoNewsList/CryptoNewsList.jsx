import { List } from "@mui/material";
import { NewsItem } from "../NewsItem/NewsItem";

function CryptoNewsList({ items }) {
  return (
    <List>
      {items.map((item) => (
        <NewsItem key={item.id} item={item} />
      ))}
    </List>
  );
}

export { CryptoNewsList };
