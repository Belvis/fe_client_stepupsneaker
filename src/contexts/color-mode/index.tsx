import { RefineThemes } from "@refinedev/antd";
import { ConfigProvider, theme } from "antd";
import viVN from "antd/locale/vi_VN";
import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type ColorModeContextType = {
  mode: string;
  setMode: (mode: string) => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const colorModeFromLocalStorage = localStorage.getItem("colorMode");
  const isSystemPreferenceDark = window?.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const systemPreference = isSystemPreferenceDark ? "dark" : "light";
  const [mode, setMode] = useState(
    colorModeFromLocalStorage || systemPreference
  );

  useEffect(() => {
    window.localStorage.setItem("colorMode", mode);
  }, [mode]);

  const setColorMode = () => {
    if (mode === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  const { darkAlgorithm, defaultAlgorithm } = theme;

  return (
    <ColorModeContext.Provider
      value={{
        setMode: setColorMode,
        mode,
      }}
    >
      <ConfigProvider
        locale={i18n.language == "vi" ? viVN : undefined}
        // you can change the theme colors here. example: ...RefineThemes.Magenta,
        theme={{
          ...RefineThemes.Orange,
          algorithm: mode === "light" ? defaultAlgorithm : darkAlgorithm,
          // token: {
          //   // Seed Token
          //   // colorPrimary: '#00b96b',
          //   // borderRadius: 2,
          //   // // Alias Token
          //   // colorBgContainer: '#f6ffed',
          // },
          components: {
            Table: {
              headerBg: mode === "light" ? "#fb5231" : "#141414",
              headerColor: mode === "light" ? "#ffffff" : undefined,
              headerSplitColor: mode === "light" ? "#ffffff" : undefined,
              rowHoverBg: mode === "light" ? "#fff2e8" : undefined,
              headerSortActiveBg: mode === "light" ? "#bfbfbf" : undefined,
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ColorModeContext.Provider>
  );
};
