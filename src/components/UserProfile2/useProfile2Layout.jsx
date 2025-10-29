import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import React from "react";

export const useProfile2Layout = () => {
    const { theme } = useJumboTheme();
    return React.useMemo(
        () => ({
            rightSidebarOptions: {
                sx: {
                    display: "flex",
                    flexShrink: 0,
                    flexDirection: "column",
                    width: { md: "auto", lg: 350 },
                },
            },
            wrapperOptions: {
                sx: {
                    flexDirection: { xs: "column", lg: "row" },
                },
            },
            contentOptions: {
                sx: {
                    p: { lg: 0, sm: 0, xs: 0 },
                    mr: { lg: 3 },
                },
            },
            mainOptions: {
                sx: {
                    minHeight: 0,
                },
            },
        }),
        [theme]
    );
};