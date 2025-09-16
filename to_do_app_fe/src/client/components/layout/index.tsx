import React, { useState } from "react";
import { Layout as AntdLayout, ConfigProvider, Grid, Drawer } from "antd";
import { Header } from "./header";
import { LeftSidebar } from "./left-sidebar/left-sidebar";

const { Sider, Content } = AntdLayout;
const { useBreakpoint } = Grid;

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md; // md = 768px

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0f172a",
        },
      }}
    >
      <AntdLayout style={{ minHeight: "100vh" }}>
        {/* Desktop: Sider cố định */}
        {!isMobile && (
          <Sider
            width={230}
            style={{
              backgroundColor: "#0c1324",
              position: "sticky",
              top: 0,
              height: "100vh",
              overflow: "auto",
            }}
            breakpoint="md"
            collapsedWidth={0}
          >
            <LeftSidebar />
          </Sider>
        )}

        {/* Main area */}
        <AntdLayout style={{ flex: 1 }}>
          <Header onMenuClick={() => setDrawerVisible(true)} />

          <Content style={{ padding: 16, background: "#ffffff" }}>
            {children}
          </Content>
        </AntdLayout>

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            placement="left"
            closable={false}
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            bodyStyle={{ padding: 0, backgroundColor: "#0c1324" }}
            width={230}
            destroyOnClose
          >
            {/* LeftSidebar nhận onNavigate để đóng Drawer khi click item */}
            <LeftSidebar onNavigate={() => setDrawerVisible(false)} />
          </Drawer>
        )}
      </AntdLayout>
    </ConfigProvider>
  );
};
