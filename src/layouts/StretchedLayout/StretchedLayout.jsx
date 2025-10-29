
import { CustomizerButton } from "@/components/CustomizerButton";
import { CustomizerSettings } from "@/components/CustomizerSettings";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { getMenus } from "@/components/Sidebar/menus-items";
import { defaultLayoutConfig } from "@/config/layouts";
import {
  JumboLayout,
  JumboLayoutProvider,
} from "@jumbo/components/JumboLayout";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export function StretchedLayout() {
  const location = useLocation();
  const menus = getMenus();
  return (
    <JumboLayoutProvider layoutConfig={defaultLayoutConfig}>
      <JumboLayout
        header={<Header />}
        footer={<Footer />}
        sidebar={<Sidebar menus={menus} />}
      >
        {location.pathname === "/" && <Navigate to={"/dashboards/misc"} />}
        <Outlet />
        <CustomizerSettings />
        <CustomizerButton />
      </JumboLayout>
    </JumboLayoutProvider>
  );
}
