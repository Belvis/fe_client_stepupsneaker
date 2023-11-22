import { Action, IResourceItem, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp } from "antd";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { dataProvider } from "./api/dataProvider";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { Footer, Header } from "./wrappers";
import NotFound from "./pages/other/NotFound";
import { HomePage } from "./pages/home";
import { ThemedLayoutV2 } from "./layouts/themedLayoutV2";
import Cart from "./pages/other/Cart";
import ScrollToTop from "./helpers/scroll-top";
import { Suspense } from "react";
import ShopGridStandard from "./pages/shop/ShopGridStandard";
import Checkout from "./pages/other/Checkout";
import Compare from "./pages/other/Compare";
import Wishlist from "./pages/other/Wishlist";
import ProductTabLeft from "./pages/product/ProductTabLeft";
import LoginRegister from "./pages/other/LoginRegister";
import MyAccount from "./pages/other/MyAccount";
import Success from "./pages/other/Success";
import OrderTracking from "./pages/other/OrderTracking";

// Icons

// Pages

// const API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_LOCAL_BASE_URL;

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <ConfirmDialog />
            <Refine
              dataProvider={dataProvider(API_BASE_URL)}
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
                      path=""
                      element={
                        <ThemedLayoutV2
                          Header={() => (
                            <Header
                              layout="container-fluid"
                              headerPaddingClass="header-padding-1"
                              headerBgClass="bg-white"
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
                      <Route path={"/cart"} element={<Cart />} />
                      <Route path={"/checkout"} element={<Checkout />} />
                      <Route path={"/compare"} element={<Compare />} />
                      <Route path={"/wishlist"} element={<Wishlist />} />
                      <Route
                        path={"/login-register"}
                        element={<LoginRegister />}
                      />
                      <Route path={"/my-account"} element={<MyAccount />} />
                      <Route path={"/success/:id"} element={<Success />} />
                      <Route
                        path={"/orders/tracking/:id"}
                        element={<OrderTracking />}
                      />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </Suspense>
              </ScrollToTop>
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
