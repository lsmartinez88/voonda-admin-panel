import { LoginForm } from "@/components/LoginForm";
import { ASSET_AVATARS, ASSET_IMAGES } from "@/utilities/constants/paths";
import { getAssetPath } from "@/utilities/helpers";
import { Div, Link } from "@jumbo/shared";
import { Facebook, Google, Twitter } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import shadows from "@mui/material/styles/shadows";
import { useTranslation } from "react-i18next";

export default function Login1() {
  const { t } = useTranslation();
  return (
    <Div
      sx={{
        flex: 1,
        flexWrap: "wrap",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: (theme) => theme.spacing(4),
      }}
    >
      <Div sx={{ mb: 3, display: "inline-flex" }}>
        <Link to="/" underline="none" sx={{ display: "inline-flex" }}>
          <img src={`${ASSET_IMAGES}/voonda-logo.png`} alt="Voonda" width={150} />
        </Link>
      </Div>
      <Card sx={{ maxWidth: "100%", width: 360, mb: 4 }}>
        <Div sx={{ position: "relative", height: "200px" }}>
          <CardMedia
            component="img"
            alt="green iguana"
            height="200"
            image={`${ASSET_IMAGES}/fondo-login.png`}
          />
          <Div
            sx={{
              flex: 1,
              inset: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              backgroundColor: (theme) =>
                alpha(theme.palette.common.black, 0.5),
              p: (theme) => theme.spacing(3),
            }}
          >
            <Typography
              variant={"h2"}
              sx={{
                color: "common.white",
                fontSize: "1.5rem",
                mb: 0,
              }}
            >
              {t("login.signIn")}
            </Typography>
          </Div>
        </Div>
        <CardContent sx={{ pt: 0 }}>
          <Avatar
            alt="Avatar"
            src={`${ASSET_AVATARS}/avatar-login.png`}
            sx={{
              width: 56,
              height: 56,
              marginLeft: "auto",
              boxShadow: shadows[3],
              transform: "translateY(-50%)",
              backgroundColor: "white",
              padding: "4px",
              objectFit: "contain"
            }}
          />
          <LoginForm />

          <Typography textAlign={"center"} variant={"body1"} mb={1}>
            {t("login.account")}{" "}
            <Link underline="none" to={"/auth/signup-1"}>
              {t("login.recover")}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Div>
  );
}
