
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { Container, Stack, useMediaQuery } from "@mui/material";
import { useParams } from "react-router-dom";
import { useMailLayout } from "./useMailLayout";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { PageHeader } from "../PageHeader";
import { ContentLayout } from "@/layouts/ContentLayout";
import { MailAppSidebar } from "./MailAppSidebar";
import { FolderDropdown } from "./FolderDropdown";
import { FilterDropdown } from "./FilterDropdown";
import { LabelDropdown } from "./LabelDropdown";
import { MailFab } from "./MailFab";
import { MailDetail } from "./MailDetail";
import { MailsList } from "./MailsList";

export const MailApp = () => {
    const mailLayoutConfig = useMailLayout();
    const { theme } = useJumboTheme();
    const { mailID } = useParams();
    const lg = useMediaQuery(theme.breakpoints.down("lg"));
    return (
        <Container
            maxWidth={false}
            sx={{
                maxWidth: CONTAINER_MAX_WIDTH,
                display: "flex",
                minWidth: 0,
                flex: 1,
                flexDirection: "column",
            }}
            disableGutters
        >
            <ContentLayout
                header={
                    <PageHeader
                        title={"Mail App"}
                        subheader={"A ready to integrate ui to build a mails module."}
                    />
                }
                sidebar={<MailAppSidebar />}
                {...mailLayoutConfig}
            >
                {lg && (
                    <Stack spacing={2} direction={"row"} sx={{ mb: 3, mt: -2 }}>
                        <FolderDropdown />
                        <FilterDropdown />
                        <LabelDropdown />
                        <MailFab />
                    </Stack>
                )}
                {mailID ? <MailDetail /> : <MailsList />}
            </ContentLayout>
        </Container>
    );
};
