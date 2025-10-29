import { Icon } from "@jumbo/components/Icon";
import { Link } from "@jumbo/shared";
import CircleIcon from "@mui/icons-material/Circle";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useJumboNavItemSx, useJumboNavbar } from "../../hooks";

function JumboNavItem({ item, isNested }) {
  const navSx = useJumboNavItemSx(item?.path ?? "");
  const { miniAndClosed, navItemSx } = useJumboNavbar();

  //TODO: this component depends on this useTranslations

  const defaultNavItemSx = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    color: "inherit",
    p: (theme) =>
      !miniAndClosed
        ? typeof theme.spacing === "function"
          ? theme.spacing(1, 3.75)
          : 0
        : 0,
    ...(miniAndClosed ? { justifyContent: "center" } : {}),
  };
  const navItemSxValue = navItemSx
    ? navItemSx(defaultNavItemSx, miniAndClosed)
    : defaultNavItemSx;
  if (!item) return null;

  return (
    <ListItemButton component={"li"} sx={{ ...navSx }}>
      <Link
        underline={"none"}
        to={item.path}
        {...(item.target ? { target: item.target } : {})}
        sx={navItemSxValue}
      >
        <ListItemIcon
          sx={{ minWidth: miniAndClosed ? 20 : 32, color: "inherit" }}
        >
          {isNested ? (
            <CircleIcon sx={{ fontSize: 6, ml: 1 }} />
          ) : typeof item.icon === "string" ? (
            <Icon name={item.icon} sx={{ fontSize: 20 }} />
          ) : (
            item.icon
          )}
        </ListItemIcon>
        {!miniAndClosed && (
          <ListItemText
            primary={item.label}
            sx={{
              m: 0,
              "& .MuiTypography-root": {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          />
        )}
      </Link>
    </ListItemButton>
  );
}

export { JumboNavItem };
