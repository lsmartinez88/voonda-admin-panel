import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { Card, useMediaQuery } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";

export const useChatLayout = () => {
    const { theme } = useJumboTheme();
    const md = useMediaQuery(theme.breakpoints.down("md"));
    const { id } = useParams();
    return React.useMemo(
        () => ({
            sidebarOptions: {
                sx:
                    md && id
                        ? { display: "none" }
                        : {
                            display: "flex",
                            minWidth: 0,
                            flexShrink: 0,
                            flexDirection: "column",
                            width: 280,
                            borderRight: 1,
                            minHeight: "100%",
                            borderRightColor: (theme) => theme.palette.divider,
                            [theme.breakpoints.down("md")]: {
                                width: "auto",
                                border: "none",
                            },
                        },
            },
            wrapperOptions: {
                component: Card,
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
        [theme, id]
    );
};