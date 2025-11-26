import React, { lazy } from "react";
import { Page } from "@/components/Page";
import { ActiveLogin } from "@/components/settings/ActiveLogin";
import { AdvertisingSettings } from "@/components/settings/AdvertisingSettings";
import { EmailAccessSettings } from "@/components/settings/EmailAccessSettings";
import { InvoiceSettings } from "@/components/settings/InvoiceSettings";
import { MembershipPlans } from "@/components/settings/MembershipPlans";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { OrganizationSettings } from "@/components/settings/OrganizationSettings";
import { PaymentMethodSettings } from "@/components/settings/PaymentMethodSettings";
import { PublicProfile } from "@/components/settings/PublicProfile";
import { ResetPasswordSettings } from "@/components/settings/ResetPasswordSettings";
import { StatementSettings } from "@/components/settings/StatementSettings";
import { TeamSettings } from "@/components/settings/TeamSettings";
import { TwoFactorAuth } from "@/components/settings/TwoFactorAuth";
import withAuth from "@/hoc/withAuth";
import { SettingsLayout } from "@/layouts/SettingsLayout";
import { SoloLayout } from "@/layouts/SoloLayout";
import { StretchedLayout } from "@/layouts/StretchedLayout";
import ChatAppPage from "@/pages/apps/chat";
import ContactAppPage from "@/pages/apps/contact";
import Invoice1Page from "@/pages/apps/invoice-1";
import MailAppPage from "@/pages/apps/mail";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import Login1 from "@/pages/auth/login1";
import Login2 from "@/pages/auth/login2";
import ResetPasswordPage from "@/pages/auth/reset-password";
import Signup1 from "@/pages/auth/signup1";
import Signup2 from "@/pages/auth/signup2";
import CrmPage from "@/pages/dashboards/crm";
import CryptoPage from "@/pages/dashboards/crypto";
import EcommercePage from "@/pages/dashboards/ecommerce";
import IntranetPage from "@/pages/dashboards/intranet";
import ListingPage from "@/pages/dashboards/listing";
import MiscPage from "@/pages/dashboards/misc";
import NewsPage from "@/pages/dashboards/news";
import DnDPage from "@/pages/extensions/dnd";
import DropzonePage from "@/pages/extensions/dropzone";
import CkEditorPage from "@/pages/extensions/editors/ck";
import WysiwygEditorPage from "@/pages/extensions/editors/wysiwyg";
import SweetAlertsPage from "@/pages/extensions/sweet-alert";
import NotFoundPage from "@/pages/extra-pages/404";
import InternalServerPage from "@/pages/extra-pages/500";
import AboutUsPage from "@/pages/extra-pages/about-us";
import CallOutsPage from "@/pages/extra-pages/call-outs";
import ContactUsPage from "@/pages/extra-pages/contact-us";
import LockscreenPage from "@/pages/extra-pages/lock-screen";
import PricingPlanPage from "@/pages/extra-pages/pricing-plan";
import ProjectsGridPage from "@/pages/grid-views/projects";
import UsersGridPage from "@/pages/grid-views/users";
import ProjectsListPage from "@/pages/list-views/projects";
import UsersListPage from "@/pages/list-views/users";
import UploadPage from "@/pages/upload";
import SyncCatalogPage from "@/pages/sync-catalog";
import VehiculosPage from "@/pages/vehiculos";
import VoondaAdminLayout from "@/layouts/VoondaAdminLayout";
import { HorariosAtencion } from "@/components/voonda-admin/HorariosAtencion";
import MetricsPage from "@/pages/metrics";
import BasicCalendarPage from "@/pages/modules/calendars/basic";
import CultureCalendarPage from "@/pages/modules/calendars/culture";
import PopupCalendarPage from "@/pages/modules/calendars/popup";
import RenderingCalendarPage from "@/pages/modules/calendars/rendering";
import SelectableCalendarPage from "@/pages/modules/calendars/selectable";
import TimeslotCalendarPage from "@/pages/modules/calendars/timeslot";
import AreaChartPage from "@/pages/modules/charts/area";
import BarChartPage from "@/pages/modules/charts/bar";
import ComposedChartPage from "@/pages/modules/charts/composed";
import LineChartPage from "@/pages/modules/charts/line";
import PieChartPage from "@/pages/modules/charts/pie";
import RadarChartPage from "@/pages/modules/charts/radar";
import RadialChartPage from "@/pages/modules/charts/radial";
import ScatterChartPage from "@/pages/modules/charts/scatter";
import TreeMapChartPage from "@/pages/modules/charts/treemap";

// Lazy imports para componentes de mapas (evita cargar Google Maps innecesariamente)
const MarkerClustererPage = lazy(() => import("@/pages/modules/maps/clustering"));
const DirectionsMapPage = lazy(() => import("@/pages/modules/maps/directions"));
const DrawingViewMapPage = lazy(() => import("@/pages/modules/maps/drawing"));
const GeoLocationMapPage = lazy(() => import("@/pages/modules/maps/geo-location"));
const KmLayerMapPage = lazy(() => import("@/pages/modules/maps/kml"));
const OverlayMapPage = lazy(() => import("@/pages/modules/maps/overlay"));
const PopupInfoMapPage = lazy(() => import("@/pages/modules/maps/popup-info"));
const SimpleMapPage = lazy(() => import("@/pages/modules/maps/simple"));
const StreetViewPanoramaPage = lazy(() => import("@/pages/modules/maps/street-view"));
const StyledMapPage = lazy(() => import("@/pages/modules/maps/styled"));

// import AccordionPage from "@/pages/modules/muiComponents/data-display/accordion"; // COMENTADO - archivo no existe
import Onboarding1Page from "@/pages/onboarding-1";
import Onboarding2Page from "@/pages/onboarding-2";
import Onboarding3Page from "@/pages/onboarding-3";
import UserProfile1Page from "@/pages/user/profile-1";
import UserProfile2Page from "@/pages/user/profile-2";
import UserProfile3Page from "@/pages/user/profile-3";
import UserProfile4Page from "@/pages/user/profile-4";
import SocialWallApp from "@/pages/user/social-wall";
import { WidgetsPage } from "@/pages/widgets";
import { createBrowserRouter, Navigate } from "react-router-dom";

const routes = [
  {
    path: "/",
    element: <StretchedLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/voonda/vehiculos" replace />,
      },
      {
        path: "/dashboards/misc",
        element: <Page Component={MiscPage} hoc={withAuth} />,
      },
      {
        path: "/dashboards/crypto",
        element: <Page Component={CryptoPage} hoc={withAuth} />,
      },
      {
        path: "/dashboards/listing",
        element: <Page Component={ListingPage} hoc={withAuth} />,
      },
      {
        path: "/dashboards/crm",
        element: <Page Component={CrmPage} hoc={withAuth} />,
      },
      {
        path: "/dashboards/intranet",
        element: <Page Component={IntranetPage} hoc={withAuth} />,
      },
      {
        path: "/dashboards/ecommerce",
        element: <Page Component={EcommercePage} hoc={withAuth} />,
      },
      {
        path: "/dashboards/news",
        element: <Page Component={NewsPage} hoc={withAuth} />,
      },
      {
        path: "/widgets",
        element: <Page Component={WidgetsPage} hoc={withAuth} />,
      },
      {
        path: "/metrics",
        element: <Page Component={MetricsPage} hoc={withAuth} />,
      },
      {
        path: "/apps/chat",
        element: <Page Component={ChatAppPage} hoc={withAuth} />,
      },
      {
        path: "/apps/chat/:chatBy/:id",
        element: <Page Component={ChatAppPage} hoc={withAuth} />,
      },
      {
        path: "/apps/contact",
        element: <Page Component={ContactAppPage} hoc={withAuth} />,
      },
      {
        path: "/apps/contact/:category",
        element: <Page Component={ContactAppPage} hoc={withAuth} />,
      },
      {
        path: "/apps/contact/label/:labelID",
        element: <Page Component={ContactAppPage} hoc={withAuth} />,
      },
      {
        path: "/apps/mail/:category",
        element: <Page Component={MailAppPage} hoc={withAuth} />,
      },

      {
        path: "/apps/mail/message/:mailID",
        element: <Page Component={MailAppPage} hoc={withAuth} />,
      },
      {
        path: "/apps/mail/message/:mailID",
        element: <Page Component={MailAppPage} hoc={withAuth} />,
      },
      {
        path: "/apps/mail/label/:labelID",
        element: <Page Component={MailAppPage} hoc={withAuth} />,
      },
      {
        path: "/apps/invoice",
        element: <Page Component={Invoice1Page} hoc={withAuth} />,
      },
      {
        path: "/extensions/editors/ck",
        element: <Page Component={CkEditorPage} hoc={withAuth} />,
      },
      {
        path: "/extensions/editors/wysiwyg",
        element: <Page Component={WysiwygEditorPage} hoc={withAuth} />,
      },
      {
        path: "/extensions/dnd",
        element: <Page Component={DnDPage} hoc={withAuth} />,
      },
      {
        path: "/extensions/dropzone",
        element: <Page Component={DropzonePage} hoc={withAuth} />,
      },
      {
        path: "/extensions/sweet-alert",
        element: <Page Component={SweetAlertsPage} hoc={withAuth} />,
      },
      {
        path: "/modules/calendars/basic",
        element: <Page Component={BasicCalendarPage} hoc={withAuth} />,
      },
      {
        path: "/modules/calendars/culture",
        element: <Page Component={CultureCalendarPage} hoc={withAuth} />,
      },
      {
        path: "/modules/calendars/popup",
        element: <Page Component={PopupCalendarPage} hoc={withAuth} />,
      },
      {
        path: "/modules/calendars/rendering",
        element: <Page Component={RenderingCalendarPage} hoc={withAuth} />,
      },
      {
        path: "/modules/calendars/selectable",
        element: <Page Component={SelectableCalendarPage} hoc={withAuth} />,
      },
      {
        path: "/modules/calendars/timeslot",
        element: <Page Component={TimeslotCalendarPage} hoc={withAuth} />,
      },
      {
        path: "/modules/charts/line",
        element: <Page Component={LineChartPage} hoc={withAuth} />,
      },
      {
        path: "/modules/charts/bar",
        element: <Page Component={BarChartPage} hoc={withAuth} />,
      },
      {
        path: "/modules/charts/area",
        element: <Page Component={AreaChartPage} hoc={withAuth} />,
      },
      {
        path: "/modules/charts/composed",
        element: <Page Component={ComposedChartPage} hoc={withAuth} />,
      },
      {
        path: "/modules/charts/pie",
        element: <Page Component={PieChartPage} hoc={withAuth} />,
      },
      {
        path: "/modules/charts/scatter",
        element: <Page Component={ScatterChartPage} hoc={withAuth} />,
      },
      {
        path: "/modules/charts/radial",
        element: <Page Component={RadialChartPage} hoc={withAuth} />,
      },
      {
        path: "/modules/charts/radar",
        element: <Page Component={RadarChartPage} hoc={withAuth} />,
      },
      {
        path: "/modules/charts/treemap",
        element: <Page Component={TreeMapChartPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/simple",
        element: <Page Component={SimpleMapPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/styled",
        element: <Page Component={StyledMapPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/geo-location",
        element: <Page Component={GeoLocationMapPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/directions",
        element: <Page Component={DirectionsMapPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/overlay",
        element: <Page Component={OverlayMapPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/kml",
        element: <Page Component={KmLayerMapPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/popup-info",
        element: <Page Component={PopupInfoMapPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/street-view",
        element: <Page Component={StreetViewPanoramaPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/drawing",
        element: <Page Component={DrawingViewMapPage} hoc={withAuth} />,
      },
      {
        path: "/modules/maps/clustering",
        element: <Page Component={MarkerClustererPage} hoc={withAuth} />,
      },
      {
        path: "/extra-pages/about-us",
        element: <Page Component={AboutUsPage} hoc={withAuth} />,
      },
      {
        path: "/extra-pages/contact-us",
        element: <Page Component={ContactUsPage} hoc={withAuth} />,
      },
      {
        path: "/extra-pages/call-outs",
        element: <Page Component={CallOutsPage} hoc={withAuth} />,
      },
      {
        path: "/extra-pages/pricing-plan",
        element: <Page Component={PricingPlanPage} hoc={withAuth} />,
      },
      {
        path: "/user/profile-1",
        element: <Page Component={UserProfile1Page} hoc={withAuth} />,
      },
      {
        path: "/user/profile-2",
        element: <Page Component={UserProfile2Page} hoc={withAuth} />,
      },
      {
        path: "/user/profile-3",
        element: <Page Component={UserProfile3Page} hoc={withAuth} />,
      },
      {
        path: "/user/profile-4",
        element: <Page Component={UserProfile4Page} hoc={withAuth} />,
      },
      {
        path: "/user/social-wall",
        element: <Page Component={SocialWallApp} hoc={withAuth} />,
      },
      {
        path: "/user/settings",
        element: <SettingsLayout />,
        children: [
          {
            path: "public-profile",
            element: <Page Component={PublicProfile} hoc={withAuth} />,
          },
          {
            path: "team",
            element: <Page Component={TeamSettings} hoc={withAuth} />,
          },
          {
            path: "login-devices",
            element: <Page Component={ActiveLogin} hoc={withAuth} />,
          },
          {
            path: "organizations",
            element: <Page Component={OrganizationSettings} hoc={withAuth} />,
          },
          {
            path: "emails",
            element: <Page Component={EmailAccessSettings} hoc={withAuth} />,
          },
          {
            path: "reset-password",
            element: <Page Component={ResetPasswordSettings} hoc={withAuth} />,
          },
          {
            path: "2-factor-auth",
            element: <Page Component={TwoFactorAuth} hoc={withAuth} />,
          },
          {
            path: "membership-plans",
            element: <Page Component={MembershipPlans} hoc={withAuth} />,
          },
          {
            path: "payment-methods",
            element: <Page Component={PaymentMethodSettings} hoc={withAuth} />,
          },
          {
            path: "invoices",
            element: <Page Component={InvoiceSettings} hoc={withAuth} />,
          },
          {
            path: "statements",
            element: <Page Component={StatementSettings} hoc={withAuth} />,
          },
          {
            path: "advertising",
            element: <Page Component={AdvertisingSettings} hoc={withAuth} />,
          },
          {
            path: "notifications",
            element: <Page Component={NotificationSettings} hoc={withAuth} />,
          },
        ],
      },
      {
        path: "/list-views/projects",
        element: <Page Component={ProjectsListPage} hoc={withAuth} />,
      },
      {
        path: "/list-views/users",
        element: <Page Component={UsersListPage} hoc={withAuth} />,
      },
      {
        path: "/grid-views/projects",
        element: <Page Component={ProjectsGridPage} hoc={withAuth} />,
      },
      {
        path: "/grid-views/users",
        element: <Page Component={UsersGridPage} hoc={withAuth} />,
      },
      // /** Voonda routes */
      {
        path: "/voonda/upload",
        element: <Page Component={UploadPage} hoc={withAuth} />,
      },
      {
        path: "/voonda/sync-catalog",
        element: <Page Component={SyncCatalogPage} hoc={withAuth} />,
      },
      {
        path: "/voonda/vehiculos",
        element: <Page Component={VehiculosPage} hoc={withAuth} />,
      },
      {
        path: "/voonda/admin",
        element: <VoondaAdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/voonda/admin/horarios-atencion" replace />,
          },
          {
            path: "horarios-atencion",
            element: <Page Component={HorariosAtencion} hoc={withAuth} />,
          },
        ],
      },
      // /** extra routes */
      {
        path: "/onboarding-1",
        element: <Page Component={Onboarding1Page} hoc={withAuth} />,
      },
      {
        path: "/onboarding-2",
        element: <Page Component={Onboarding2Page} hoc={withAuth} />,
      },
      {
        path: "/onboarding-3",
        element: <Page Component={Onboarding3Page} hoc={withAuth} />,
      },
    ],
  },

  {
    path: "/auth",
    element: <SoloLayout />,
    children: [
      {
        path: "login-1",
        element: <Login1 />,
      },
      {
        path: "login-2",
        element: <Login2 />,
      },
      {
        path: "signup-1",
        element: <Signup1 />,
      },
      {
        path: "signup-2",
        element: <Signup2 />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    path: "/extra-pages",
    element: <SoloLayout />,
    children: [
      {
        path: "404",
        element: <NotFoundPage />,
      },
      {
        path: "500",
        element: <InternalServerPage />,
      },
      {
        path: "lock-screen",
        element: <LockscreenPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);
