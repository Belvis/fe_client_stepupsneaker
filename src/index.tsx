import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import PersistProvider from "./redux/providers/persist-provider";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";

import WeekDay from "dayjs/plugin/weekday";
import LocaleData from "dayjs/plugin/localeData";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

import App from "./App";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "./i18n";
import "./global.css";

import "animate.css";
import "swiper/swiper-bundle.min.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "./assets/scss/style.scss";
import { store } from "./redux/store";
import { Spin } from "antd";

dayjs.extend(WeekDay);
dayjs.extend(LocaleData);
dayjs.extend(LocalizedFormat);

// store.dispatch(setProducts(products));

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <React.Suspense fallback={<Spin fullscreen />}>
      <Provider store={store}>
        <PersistProvider>
          <App />
        </PersistProvider>
      </Provider>
    </React.Suspense>
  </React.StrictMode>
);
