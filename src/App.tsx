import { Action, Authenticated, IResourceItem, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp } from "antd";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { authProvider } from "./api/authProvider";
import { dataProvider } from "./api/dataProvider";
import { ColorModeContextProvider } from "./contexts/color-mode";
import ScrollToTop from "./helpers/scroll-top";
import { ThemedLayoutV2 } from "./layouts/themedLayoutV2";
import { HomePage } from "./pages/home";
import Cart from "./pages/other/Cart";
import Checkout from "./pages/other/Checkout";
import Compare from "./pages/other/Compare";
import LoginRegister from "./pages/other/LoginRegister";
import MyAccount from "./pages/other/MyAccount";
import MyOrders from "./pages/other/MyOrders";
import NotFound from "./pages/other/NotFound";
import OrderDetail from "./pages/other/OrderDetail";
import OrderTracking from "./pages/other/OrderTracking";
import SubmissionFailed from "./pages/other/SubmissionFailed";
import Success from "./pages/other/Success";
import TrackingPage from "./pages/other/TrackingPage";
import Wishlist from "./pages/other/Wishlist";
import ProductTabLeft from "./pages/product/ProductTabLeft";
import ShopGridStandard from "./pages/shop/ShopGridStandard";
import { Footer, Header } from "./wrappers";
import Contact from "./pages/other/Contact";
import About from "./pages/other/About";
import ResetPassword from "./pages/other/ResetPassword";
import ForgotPassword from "./pages/other/ForgotPassword";

// Icons

// Pages

const API_BASE_URL = `${window.location.protocol}//${
  window.location.hostname
}:${import.meta.env.VITE_BACKEND_API_BASE_PATH}`;

const AUTH_API_URL = `${window.location.protocol}//${
  window.location.hostname
}:${import.meta.env.VITE_BACKEND_API_AUTH_PATH}`;

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  const titleHandler = ({
    resource,
    action,
    params,
  }: {
    resource?: IResourceItem;
    action?: Action;
    params?: Record<string, string | undefined>;
  }): string => {
    return "SUNS";
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <ConfirmDialog />
            <Refine
              dataProvider={dataProvider(API_BASE_URL)}
              authProvider={authProvider(AUTH_API_URL)}
              notificationProvider={useNotificationProvider}
              i18nProvider={i18nProvider}
              routerProvider={routerBindings}
              resources={[]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "w0HqFF-uDUAxj-x2TmsR",
              }}
            >
              <ScrollToTop>
                <Suspense
                  fallback={
                    <div className="flone-preloader-wrapper">
                      <div className="flone-preloader">
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  }
                >
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <ThemedLayoutV2
                          Header={() => (
                            <Header
                              layout="container-fluid"
                              headerPaddingClass="header-padding-1"
                              headerBgClass="bg-white"
                              top="visible"
                            />
                          )}
                          Sider={() => <></>}
                          Footer={() => (
                            <Footer
                              backgroundColorClass="bg-gray"
                              spaceTopClass="pt-100"
                              spaceBottomClass="pb-70"
                            />
                          )}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      }
                    >
                      <Route index element={<HomePage />} />
                      <Route path={"/shop"} element={<ShopGridStandard />} />
                      <Route
                        path={"/product/:id"}
                        element={<ProductTabLeft />}
                      />
                      <Route path="contact" element={<Contact />} />
                      <Route path="about_us" element={<About />} />
                      <Route path="/pages">
                        <Route path="checkout" element={<Checkout />} />
                        <Route path="cart" element={<Cart />} />
                        <Route path="compare" element={<Compare />} />
                        <Route path="wishlist" element={<Wishlist />} />

                        <Route
                          element={
                            <Authenticated
                              fallback={<CatchAllNavigate to="/login" />}
                            >
                              <Outlet />
                            </Authenticated>
                          }
                        >
                          <Route path="my-account">
                            <Route index element={<MyAccount />} />
                            <Route path={"orders"}>
                              <Route index element={<MyOrders />} />
                              <Route path=":id" element={<OrderDetail />} />
                            </Route>
                          </Route>
                        </Route>
                      </Route>

                      <Route path="/success/:id" element={<Success />} />
                      <Route
                        path="/submission-failed"
                        element={<SubmissionFailed />}
                      />
                      <Route path="/tracking">
                        <Route index element={<TrackingPage />} />
                        <Route path=":code" element={<OrderTracking />} />
                      </Route>

                      <Route
                        element={
                          <Authenticated fallback={<Outlet />}>
                            <Navigate to="/" />
                          </Authenticated>
                        }
                      >
                        <Route
                          path="login"
                          element={<LoginRegister type="login" />}
                        />
                        <Route
                          path="register"
                          element={<LoginRegister type="register" />}
                        />
                        {/* forgot-password */}
                        {/* update-password */}
                      </Route>

                      <Route
                        path="/reset-password"
                        element={<ResetPassword />}
                      />
                      <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                      />

                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </Suspense>
              </ScrollToTop>
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler handler={titleHandler} />
            </Refine>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
