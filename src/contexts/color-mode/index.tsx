import { RefineThemes } from "@refinedev/antd";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import { PropsWithChildren, createContext } from "react";
import { useTranslation } from "react-i18next";

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { i18n } = useTranslation();

  return (
    <ConfigProvider
      locale={i18n.language == "vi" ? viVN : undefined}
      // you can change the theme colors here. example: ...RefineThemes.Magenta,
      theme={{
        ...RefineThemes.Orange,
        // token: {
        //   // Seed Token
        //   // colorPrimary: '#00b96b',
        //   // borderRadius: 2,
        //   // // Alias Token
        //   // colorBgContainer: '#f6ffed',
        // },
        components: {
          Steps: {
            iconSize: 48,
            customIconSize: 48,
            customIconFontSize: 30,
            titleLineHeight: 32,
            iconFontSize: 30,
            descriptionMaxWidth: 180,
            fontSize: 16,
            fontSizeLG: 20,
          },
          Pagination: {
            // itemActiveBg: mode === "light" ? "#fb5231" : undefined,
            itemSize: 48,
          },
          Table: {
            headerBg: "#fb5231",
            headerColor: "#ffffff",
            headerSplitColor: "#ffffff",
            rowHoverBg: "#fff2e8",
            headerSortActiveBg: "#bfbfbf",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
