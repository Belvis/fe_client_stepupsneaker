import React, { useEffect } from "react";
import { Grid, Layout as AntdLayout } from "antd";

import {
  ThemedSiderV2 as DefaultSider,
  ThemedHeaderV2 as DefaultHeader,
  ThemedLayoutContextProvider,
  RefineThemedLayoutV2Props,
} from "@refinedev/antd";
import ScrollToTop from "../../components/scroll-to-top";
import { useDispatch } from "react-redux";
import { useIsAuthenticated } from "@refinedev/core";
import { fetchCart } from "../../redux/slices/cart-slice";
import { AppDispatch } from "../../redux/store";
import { TOKEN_KEY } from "../../utils";

export const ThemedLayoutV2: React.FC<RefineThemedLayoutV2Props> = ({
  children,
  Header,
  Sider,
  Title,
  Footer,
  OffLayoutArea,
  initialSiderCollapsed,
}) => {
  const breakpoint = Grid.useBreakpoint();
  const SiderToRender = Sider ?? DefaultSider;
  const HeaderToRender = Header ?? DefaultHeader;
  const isSmall = typeof breakpoint.sm === "undefined" ? true : breakpoint.sm;
  const hasSider = !!SiderToRender({ Title });

  const dispatch: AppDispatch = useDispatch();

  const { isLoading, data } = useIsAuthenticated();

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!isLoading && data && data.authenticated && token) {
      dispatch(fetchCart());
    }
  }, [dispatch, isLoading, data]);

  return (
    <ThemedLayoutContextProvider initialSiderCollapsed={initialSiderCollapsed}>
      <AntdLayout style={{ minHeight: "100vh" }} hasSider={hasSider}>
        <SiderToRender Title={Title} />
        <AntdLayout>
          <HeaderToRender />
          <AntdLayout.Content>
            {children}
            {OffLayoutArea && <OffLayoutArea />}
          </AntdLayout.Content>
          {Footer && <Footer />}
          <ScrollToTop />
        </AntdLayout>
      </AntdLayout>
    </ThemedLayoutContextProvider>
  );
};
