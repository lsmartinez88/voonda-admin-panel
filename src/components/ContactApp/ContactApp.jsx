
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { Container, Stack, useMediaQuery } from "@mui/material";
import { useContactLayout } from "./useContactLayout";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { ContentLayout } from "@/layouts/ContentLayout";
import { PageHeader } from "../PageHeader";
import { FolderDropdown } from "./FolderDropdown";
import { LabelDropdown } from "./LabelDropdown";
import { ContactFab } from "./ContactFab";
import { ContactsList } from "./ContactsList";
import { ContactsAppSidebar } from "./ContactsAppSidebar";


export const ContactApp = () => {
    const contactLayoutConfig = useContactLayout();
    const { theme } = useJumboTheme();
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
                        title={"Contacts"}
                        subheader={"A ready to integrate ui to build a contacts module."}
                    />
                }
                sidebar={<ContactsAppSidebar />}
                {...contactLayoutConfig}
            >
                {lg && (
                    <Stack spacing={2} direction={"row"} sx={{ mb: 3, mt: -2 }}>
                        <FolderDropdown />
                        <LabelDropdown />
                        <ContactFab />
                    </Stack>
                )}
                <ContactsList />
            </ContentLayout>
        </Container>
    );
}; 
