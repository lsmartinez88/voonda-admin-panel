import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { usersData } from "../data";

const BasicInformation = () => {
  return (
    <List
      disablePadding
      sx={{
        display: "flex",
        minWidth: 0,
        flexWrap: "wrap",
        color: "text.secondary",
        borderBottom: 1,
        borderColor: "divider",
        mb: 3.75,
        pb: 2,
        ".MuiListItem-root": {
          pl: 0,
          py: 0.5,
          width: { xs: "100%,", md: "50%" },
        },
        ".MuiListItemIcon-root": {
          color: "inherit",
          minWidth: 38,
        },
        ".MuiListItemText-root": {
          display: "flex",
          minWidth: 0,
        },
      }}
    >
      {usersData?.map((item, index) => (
        <ListItem key={index}>
          <ListItemIcon>{item?.icon}</ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body1" width={"50%"}>
                {item?.key}
              </Typography>
            }
            secondary={
              <Typography variant="body1" color="text.primary" width={"50%"}>
                {item?.value}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export { BasicInformation };
