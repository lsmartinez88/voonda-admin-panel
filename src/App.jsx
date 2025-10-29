import {
  JumboDialog,
  JumboDialogProvider,
  JumboTheme,
} from "@jumbo/components";
import JumboRTL from "@jumbo/components/JumboRTL/JumboRTL";
import { CssBaseline } from "@mui/material";
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { CONFIG } from "./config";
import { router } from "./routes";
import { Spinner } from "./components/Spinner";
import { AppProvider } from "./components/AppProvider";
import { AppSnackbar } from "./components/AppSnackbar";

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <JumboTheme init={CONFIG.THEME}>
          <CssBaseline />
          <Suspense fallback={<Spinner />}>
            <JumboRTL>
              <JumboDialogProvider>
                <JumboDialog />
                <AppSnackbar>
                  <RouterProvider router={router} />
                </AppSnackbar>
              </JumboDialogProvider>
            </JumboRTL>
          </Suspense>
        </JumboTheme>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
