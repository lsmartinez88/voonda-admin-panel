
import { UserGridItem } from "@/components/UserGridItem";
import { users } from "@/components/UserGridItem/data";
import { View } from "@/components/View";
import { CONTAINER_MAX_WIDTH } from "@/config/layouts";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function UsersGridPage() {
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
          {t("views.title.users")}
        </Typography>
        <View variant="grid" dataSource={users} renderItem={UserGridItem} />
      </Container>
    )
  );
}
