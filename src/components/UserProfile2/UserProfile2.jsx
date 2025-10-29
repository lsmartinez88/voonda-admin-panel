
import { JumboCard, JumboDdMenu } from "@jumbo/components";
import { Container } from "@mui/material";
import { useProfile2Layout } from "./useProfile2Layout";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { ContentLayout } from "@/layouts/ContentLayout";
import { Profile2Sidebar } from "./Profile2Sidebar";
import { Profile2Header } from "./Profile2Header";
import { BasicInformation } from "./BasicInformation";
import { About } from "./About";
import { ProfileWorkHistory } from "../ProfileWorkHistory";
import { experiencesData } from "../ProfileWorkHistory/data";
import { Profile2Skill } from "./Profile2Skill";
import { LicenseCertificate } from "../LicenseCertificate";


export const UserProfile2 = () => {
    const profileLayoutConfig = useProfile2Layout();
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
            {/** Content Part */}
            <ContentLayout
                rightSidebar={<Profile2Sidebar />}
                header={
                    <>
                        <Profile2Header />
                        <BasicInformation />
                    </>
                }
                {...profileLayoutConfig}
            >
                <JumboCard
                    title={"About"}
                    subheader={"Education, Work and More"}
                    action={<JumboDdMenu />}
                    contentWrapper
                    contentSx={{ pt: 0 }}
                    sx={{ mb: 3.75 }}
                >
                    <About />
                </JumboCard>
                {/** Profile Work History Component */}
                <JumboCard
                    title={"Experience"}
                    subheader={"Your work experience and achievements"}
                    action={<JumboDdMenu />}
                    contentWrapper
                    contentSx={{ pt: 0 }}
                    sx={{ mb: 3.75 }}
                >
                    <ProfileWorkHistory data={experiencesData} />
                </JumboCard>

                <JumboCard
                    title={"Skill"}
                    action={<JumboDdMenu />}
                    contentWrapper
                    contentSx={{ pt: 0 }}
                    sx={{ mb: 3.75 }}
                >
                    <Profile2Skill />
                </JumboCard>

                {/** License & Certificate */}
                <JumboCard
                    title={"License & Certificates"}
                    subheader={"Your work experience and achievements"}
                    action={<JumboDdMenu />}
                    contentWrapper
                    contentSx={{ pt: 0 }}
                    sx={{ mb: 3.75 }}
                >
                    <LicenseCertificate />
                </JumboCard>
            </ContentLayout>
        </Container>
    );
}; 
