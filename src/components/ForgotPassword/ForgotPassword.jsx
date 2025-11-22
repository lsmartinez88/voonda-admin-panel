import { ASSET_IMAGES } from "@/utilities/constants/paths";
import { Div, Link } from "@jumbo/shared";
import { JumboForm, JumboInput } from "@jumbo/vendors/react-hook-form";
import { LoadingButton } from "@mui/lab";
import {
    Card,
    CardContent,
    CardMedia,
    Stack,
    Typography,
    alpha,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export const ForgotPassword = () => {
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
                            {t("forgotPassword.title")}
                        </Typography>
                    </Div>
                </Div>
                <CardContent>
                    <JumboForm>
                        <Stack spacing={3} mb={3}>
                            <JumboInput fieldName="email" label={t("forgotPassword.email")} />
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                size="large"
                            // loading={isSubmitting || mutation.isLoading}
                            >
                                {t("forgotPassword.submit")}
                            </LoadingButton>
                        </Stack>
                    </JumboForm>

                    <Typography textAlign={"center"} variant={"body1"} mb={1}>
                        {t("forgotPassword.contactSupport")}{" "}
                        <Link underline="none" to="/">
                            {t("forgotPassword.contactSupportLink")}
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Div>
    );
}; 
