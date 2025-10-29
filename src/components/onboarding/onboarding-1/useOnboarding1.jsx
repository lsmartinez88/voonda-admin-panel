import { ASSET_IMAGES } from "@/utilities/constants/paths";
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import React from "react";

export const useOnboarding1Config = () => {
    const { theme } = useJumboTheme();

    return React.useMemo(
        () => ({
            sidebarOptions: {
                sx: {
                    display: { xs: "none", lg: "flex" },
                    minWidth: 0,
                    flexShrink: 0,
                    flexDirection: "column",
                    width: 300,
                    minHeight: "100%",
                    border: 1,
                    borderColor: (theme) => theme.palette.divider,
                    background:
                        theme.type === "light" || theme.type === "semi-dark"
                            ? `url(${ASSET_IMAGES}/payment-bg.png) no-repeat center bottom`
                            : (theme) => theme.palette.background.paper,

                    backgroundSize: "cover",
                    borderRadius: 3,
                    mr: 3,
                    p: 3,
                },
            },
            wrapperOptions: {
                sx: {
                    [theme.breakpoints.down("md")]: {
                        flexDirection: "column",
                    },
                },
                container: true,
            },
            contentOptions: {
                sx: {
                    p: { lg: 0, sm: 0, xs: 0 },
                },
            },
        }),
        [theme]
    );
};