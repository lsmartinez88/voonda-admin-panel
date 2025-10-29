import { SocialApp } from "@/components/SocialApp";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { Container } from "@mui/material";

export default function SocialWallApp() {
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
      <SocialApp />
    </Container>
  )
}