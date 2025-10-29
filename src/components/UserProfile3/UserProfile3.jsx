
import { Button, Container, IconButton } from "@mui/material";
import { RiAddLine } from "react-icons/ri";
import { useProfile3Layout } from "./useProfile3Layout";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { ContentLayout } from "@/layouts/ContentLayout";
import { Profile3Sidebar } from "./Profile3Sidebar";
import { Profile3Header } from "./Profile3Header";
import { UserAbout } from "./UserAbout";
import { JumboCard } from "@jumbo/components";
import { ProfileSkills } from "../ProfileSkills";
import { ProfileWorkHistory } from "../ProfileWorkHistory";
import { experiencesData } from "../ProfileWorkHistory/data";
import { LicenseCertificate } from "../LicenseCertificate";
import { profileSkillsData } from "../ProfileSkills/data";


export const UserProfile3 = () => {
    const profileLayoutConfig = useProfile3Layout();
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
                rightSidebar={<Profile3Sidebar />}
                header={
                    <>
                        <Profile3Header />
                        <UserAbout />
                    </>
                }
                {...profileLayoutConfig}
            >
                {/** user profile skills */}
                <JumboCard
                    title={"Profiles"}
                    contentWrapper
                    action={
                        <Button size="small" startIcon={<RiAddLine />}>
                            Add Skill Profile
                        </Button>
                    }
                    sx={{ mb: 3.75 }}
                    contentSx={{ pt: 0 }}
                >
                    <ProfileSkills data={profileSkillsData} />
                </JumboCard>

                {/** Work History  */}
                <JumboCard
                    title={"Work History"}
                    contentWrapper
                    action={
                        <IconButton color="primary">
                            <RiAddLine />
                        </IconButton>
                    }
                    sx={{
                        mb: 3.75,
                        ".MuiCardHeader-action": {
                            my: -0.5,
                            mr: -1,
                        },
                    }}
                    contentSx={{ pt: 0 }}
                >
                    <ProfileWorkHistory data={experiencesData} />
                </JumboCard>

                {/** Licence & Certificate Part */}
                <JumboCard
                    title={"License & Certificates"}
                    contentWrapper
                    action={
                        <IconButton color="primary">
                            <RiAddLine />
                        </IconButton>
                    }
                    sx={{
                        mb: 3.75,
                        ".MuiCardHeader-action": {
                            my: -0.5,
                            mr: -1,
                        },
                    }}
                    contentSx={{ pt: 0 }}
                >
                    <LicenseCertificate />
                </JumboCard>
            </ContentLayout>
        </Container>
    );
}; 
