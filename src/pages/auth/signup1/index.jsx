import { SignupForm } from "@/components/SignupForm";
import { ASSET_IMAGES, ASSET_AVATARS } from "@/utilities/constants/paths";
import { getAssetPath } from "@/utilities/helpers";
import { Div, Link } from "@jumbo/shared";
import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Typography,
  alpha,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Signup1() {
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
            image={getAssetPath(`${ASSET_IMAGES}/fondo-login.png`, "640x428")}
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
              sx={{ color: "common.white", fontSize: "1.5rem", mb: 0 }}
            >
              {t("signup.title")}
            </Typography>
          </Div>
        </Div>
        <CardContent sx={{ pt: 0 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              marginLeft: "auto",
              boxShadow: (theme) => theme.shadows[3],
              transform: "translateY(-50%)",
              backgroundColor: "white",
              padding: "4px",
              objectFit: "contain",
            }}
            alt="user"
            src={getAssetPath(`${ASSET_AVATARS}/avatar-login.png`, "56x56")}
          />
          <SignupForm />
          <Typography textAlign={"center"} variant={"body1"} mb={1}>
            {t("signup.haveAccount")}{" "}
            <Link underline="none" to={"/auth/login-1"}>
              {t("signup.signInLink")}
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Div>
  );
}
