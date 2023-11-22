import React from "react";
import { Grid, Layout as AntdLayout } from "antd";

import {
  ThemedSiderV2 as DefaultSider,
  ThemedHeaderV2 as DefaultHeader,
  ThemedLayoutContextProvider,
  RefineThemedLayoutV2Props,
} from "@refinedev/antd";
import ScrollToTop from "../../components/scroll-to-top";

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
