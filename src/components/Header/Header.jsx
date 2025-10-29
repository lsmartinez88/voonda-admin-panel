import { AuthUserPopover } from "@/components/AuthUserPopover";
import { MessagesPopover } from "@/components/MessagesPopover";
import { NotificationsPopover } from "@/components/NotificationsPopover";
import {
  useJumboLayout,
  useSidebarState,
} from "@jumbo/components/JumboLayout/hooks";
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";

import { SIDEBAR_STYLES } from "@jumbo/utilities/constants";

import { Stack, useMediaQuery } from "@mui/material";
import React from "react";
import { TranslationPopover } from "@/components/TranslationPopover";
import { ThemeModeOption } from "./ThemeModeOptions";
import { SidebarToggleButton } from "../SidebarToggleButton";
import { Logo } from "../Logo";
import { Search } from "./Search";
import { SearchIconButtonOnSmallScreen } from "./SearchIconButtonOnSmallScreen";

function Header() {
  const { isSidebarStyle } = useSidebarState();
  const [searchVisibility, setSearchVisibility] = React.useState(false);
  const { headerOptions } = useJumboLayout();
  const { theme } = useJumboTheme();
  const isBelowLg = useMediaQuery(
    theme.breakpoints.down(headerOptions?.drawerBreakpoint ?? "xl")
  );
  const handleSearchVisibility = React.useCallback((value) => {
    setSearchVisibility(value);
  }, []);

  return (
    <React.Fragment>
      <SidebarToggleButton />
      {isSidebarStyle(SIDEBAR_STYLES.CLIPPED_UNDER_HEADER) && !isBelowLg && (
        <Logo sx={{ mr: 3, minWidth: 150 }} mode={theme.type} />
      )}
      <Search show={searchVisibility} onClose={handleSearchVisibility} />
      <Stack direction="row" alignItems="center" gap={1.25} sx={{ ml: "auto" }}>
        <ThemeModeOption />
        <TranslationPopover />
        <SearchIconButtonOnSmallScreen onClick={handleSearchVisibility} />
        <MessagesPopover />
        <NotificationsPopover />
        <AuthUserPopover />
      </Stack>
    </React.Fragment>
  );
}

export { Header };
