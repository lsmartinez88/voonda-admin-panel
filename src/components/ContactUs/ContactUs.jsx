import { Card, CardMedia } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ContactUsForm } from "./ContactUsForm";
import { getAssetPath } from "@/utilities/helpers";
import { ASSET_IMAGES } from "@/utilities/constants/paths";
import { ContactsDetail } from "./ContactsDetail";
import { SocialIcons } from "./SocialIcons";
export const ContactUs = () => {
    return (
        <>
            <Card sx={{ display: "flex", mb: 3.5 }}>
                <ContactUsForm />
                <CardMedia
                    component="img"
                    sx={{
                        flexShrink: 0,
                        flexBasis: "40%",
                        display: { xs: "none", md: "block" },
                        aspectRatio: 1 / 1,
                    }}
                    image={getAssetPath(`${ASSET_IMAGES}/apps/contactus.jpg`, "640x920")}
                    alt="Contact Us"
                />
            </Card>
            <Grid container spacing={3.75} mb={3.5}>
                <ContactsDetail />
            </Grid>
            <SocialIcons />
        </>
    )
}