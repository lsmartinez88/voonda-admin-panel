
import { Stack } from "@mui/material";
import { useProfile1Layout } from "./useProfile1Layout";
import { ContentLayout } from "@/layouts/ContentLayout";
import { ProfileHeader } from "./ProfileHeader";
import { UserProfileSidebar } from "./UserProfileSidebar";
import { About } from "./About";
import { Biography } from "./Biography";
import { Events } from "../Events";


export const UserProfile1 = () => {
    const profileLayoutOptions = useProfile1Layout();
    return (
        <ContentLayout
            header={<ProfileHeader />}
            sidebar={<UserProfileSidebar />}
            {...profileLayoutOptions}
        >
            <Stack spacing={3.75}>
                <About />
                <Biography />
                <Events />
            </Stack>
        </ContentLayout>
    );
}; 
