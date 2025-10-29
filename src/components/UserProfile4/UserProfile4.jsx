import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Profile4Header } from "./Profile4Header";
import { Profile4FilterTabs } from "./Profile4FilterTabs";
import { profileMediaData } from "./data";
import { ProfileMediaItem } from "./ProfileMediaItem";

export const UserProfile4 = () => {
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
            <Profile4Header />
            <Profile4FilterTabs />

            <Grid container spacing={4} sx={{ mb: 4 }}>
                {profileMediaData?.map((profile, index) => (
                    <ProfileMediaItem profile={profile} key={index} />
                ))}
            </Grid>
        </Container>
    );
};

