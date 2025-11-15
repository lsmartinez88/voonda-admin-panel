import { Link } from "@jumbo/shared";
import {
  JumboCheckbox,
  JumboForm,
  JumboInput,
  JumboOutlinedInput,
} from "@jumbo/vendors/react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import { IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { validationSchema } from "./validation";
import { useAuth } from "@/contexts/AuthContext"; // ✅ Usar AuthContext real

const LoginForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { login, isLoading } = useAuth(); // ✅ Usar AuthContext real
  const navigate = useNavigate();
  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });

  async function handleLogin(data) {
    try {
      const result = await login({
        email: data?.email,
        password: data?.password,
      });

      if (result.success) {
        enqueueSnackbar("¡Login exitoso!", { variant: "success" });
        return navigate("/dashboards/misc");
      } else {
        enqueueSnackbar(result.error || "Credenciales inválidas", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Error al iniciar sesión", {
        variant: "error",
      });
    }
  }
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  return (
    <JumboForm
      validationSchema={validationSchema}
      onSubmit={handleLogin}
      onChange={() => { }}
    >
      <Stack spacing={3} mb={3}>
        <JumboInput
          fullWidth
          fieldName={"email"}
          label={t("login.email")}
          placeholder="Ingresa tu email"
        />
        <JumboOutlinedInput
          fieldName={"password"}
          label={t("login.password")}
          type={values.showPassword ? "text" : "password"}
          margin="none"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {values.showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
          placeholder="Ingresa tu contraseña"
        />

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <JumboCheckbox
            fieldName="rememberMe"
            label={t("login.rememberMe")}
            defaultChecked
          />
          <Typography textAlign={"right"} variant={"body1"}>
            <Link underline="none" to={"/auth/forgot-password"}>
              {t("login.forgotPassword")}
            </Link>
          </Typography>
        </Stack>
        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          loading={isLoading}
        >
          {t("login.loggedIn")}
        </LoadingButton>
      </Stack>
    </JumboForm>
  );
};

export { LoginForm };
