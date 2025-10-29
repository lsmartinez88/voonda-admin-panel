import { footerTheme as footerThemeDark } from "@/themes/footer/dark";
import { footerTheme as footerThemeDefault } from "@/themes/footer/default";
import { headerTheme as headerThemeDark } from "@/themes/header/dark";
import { headerTheme as headerThemeDefault } from "@/themes/header/default";
import { mainTheme as mainThemeDark } from "@/themes/main/dark";
import { mainTheme as mainThemeDefault } from "@/themes/main/default";
import { sidebarTheme as sidebarThemeDark } from "@/themes/sidebar/dark";
import { sidebarTheme as sidebarThemeDefault } from "@/themes/sidebar/default";
import { JumboIconButton } from "@jumbo/components/JumboIconButton";
import { useJumboLayout } from "@jumbo/components/JumboLayout/hooks";
import {
  useJumboFooterTheme,
  useJumboHeaderTheme,
  useJumboSidebarTheme,
  useJumboTheme,
} from "@jumbo/components/JumboTheme/hooks";
import { Span } from "@jumbo/shared";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import React from "react";
const ThemeModeOption = () => {
  const { theme, setTheme } = useJumboTheme();
  const { setSidebarTheme } = useJumboSidebarTheme();
  const { setHeaderTheme } = useJumboHeaderTheme();
  const { setFooterTheme } = useJumboFooterTheme();
  const { headerOptions, setHeaderOptions } = useJumboLayout();
  const handleModeChange = React.useCallback(
    (type) => {
      switch (type) {
        case "light":
          setTheme({ type: "light", ...mainThemeDefault });
          setHeaderTheme({ ...theme, ...headerThemeDefault });
          setSidebarTheme({ ...theme, ...sidebarThemeDefault });
          setFooterTheme({ ...theme, ...footerThemeDefault });
          setHeaderOptions({
            ...headerOptions,
            sx: { ...headerOptions.sx, boxShadow: "none" },
          });
          return;
        case "dark":
          setTheme({ type: "dark", ...mainThemeDark });
          setHeaderTheme({ ...theme, ...headerThemeDark });
          setSidebarTheme({ ...theme, ...sidebarThemeDark });
          setFooterTheme({ ...theme, ...footerThemeDark });
          setHeaderOptions({
            ...headerOptions,
            sx: { ...headerOptions.sx, boxShadow: 23 },
          });
          return;
      }
    },
    [theme, setTheme, setFooterTheme, setHeaderTheme, setSidebarTheme]
  );
  return (
    <Span>
      {/* <Tooltip title={`${theme.type} Mode`}> */}
      {theme.type === "light" ? (
        <JumboIconButton
          onClick={() => handleModeChange("dark")}
          elevation={23}
        >
          <LightModeOutlinedIcon sx={{ fontSize: "1.25rem" }} />
        </JumboIconButton>
      ) : (
        <JumboIconButton
          onClick={() => handleModeChange("light")}
          elevation={23}
        >
          <DarkModeOutlinedIcon sx={{ fontSize: "1.25rem" }} />
        </JumboIconButton>
      )}
      {/* </Tooltip> */}
    </Span>
  );
};

export { ThemeModeOption };
