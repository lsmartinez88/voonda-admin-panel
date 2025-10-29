import { getNavChildren } from "@jumbo/utilities/helpers";
import { Divider, ListSubheader } from "@mui/material";
import { JumboNavIdentifier } from "..";
import { useJumboNavbar } from "../../hooks";

function JumboNavSection({ item, isFirstSection }) {
  const { miniAndClosed, navSectionSx } = useJumboNavbar();
  if (!item) return null;

  const subMenus = getNavChildren(item);

  const defaultNavSectionSx = {
    fontSize: "80%",
    fontWeight: "400",
    lineHeight: "normal",
    textTransform: "uppercase",
    bgcolor: "transparent",
    p: (theme) => theme.spacing(3.75, 3.75, 1.875),
  };
  const navSectionSxValue = navSectionSx
    ? navSectionSx(defaultNavSectionSx, miniAndClosed)
    : defaultNavSectionSx;
  return (
    <>
      {miniAndClosed ? (
        !isFirstSection && <Divider sx={{ mx: 2, my: 1 }} />
      ) : (
        <ListSubheader component="li" disableSticky sx={navSectionSxValue}>
          {item.label}
        </ListSubheader>
      )}
      {subMenus &&
        subMenus.map((child, index) => {
          return <JumboNavIdentifier item={child} key={index} />;
        })}
    </>
  );
}

export { JumboNavSection };
