import React from "react";
import { ConfigProvider } from "antd";
import { ThemedLayoutV2, ThemedTitleV2 } from "@refinedev/antd";
import { Header } from "./header";
import { LeftSidebar } from "./left-sidebar/left-sidebar";

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0f172a",
        },
        components: {
          Card: {
            borderRadiusLG: 4,
            borderRadiusSM: 4,
          },
        },
      }}
    >
      <ThemedLayoutV2
        Header={Header}
        // Always provide the Sider component
        Sider={LeftSidebar} 
        Title={(titleProps) => <ThemedTitleV2 {...titleProps} text="Refine" />}
      >
        {children}
      </ThemedLayoutV2>
    </ConfigProvider>
  );
};