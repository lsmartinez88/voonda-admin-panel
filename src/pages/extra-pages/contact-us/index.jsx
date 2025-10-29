import { ContactUs } from "@/components/ContactUs";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function ContactUsPage() {
  const { t } = useTranslation();
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
      <Typography variant="h1" mb={3}>
        {t("extraPages.title.contactUs")}
      </Typography>
      <ContactUs />
    </Container>
  );
}
