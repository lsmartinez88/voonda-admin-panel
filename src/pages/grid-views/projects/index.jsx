
import { ProjectGridItem } from "@/components/ProjectGridItem";
import { projects } from "@/components/ProjectGridItem/data";
import { users } from "@/components/UserGridItem/data";
import { View } from "@/components/View";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function ProjectsGridPage() {
  const { t } = useTranslation();
  return (
    users.length > 0 && (
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
        <Typography variant={"h2"} mb={3}>
          {t("views.title.projects")}
        </Typography>
        <View variant="grid" dataSource={projects} renderItem={ProjectGridItem} />
      </Container>
    )
  );
}
