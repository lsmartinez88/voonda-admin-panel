import { ProjectListItem } from "@/components/ProjectListItem";
import { projects } from "@/components/ProjectListItem/data";
import { View } from "@/components/View";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function ProjectsListPage() {
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
      <Typography variant={"h2"} mb={3}>
        {t("views.title.projects")}
      </Typography>
      <View variant="list" dataSource={projects} renderItem={ProjectListItem} />
    </Container>
  );
}
