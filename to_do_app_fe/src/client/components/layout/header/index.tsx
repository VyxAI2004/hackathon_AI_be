import React from "react";
import { Layout, Space, theme } from "antd";
import { CurrentUser } from "../current-user";

const { useToken } = theme;

export const Header = () => {
  const { token } = useToken();

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.Layout?.headerBg ?? "#0c1324ff",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "60px",
    position: "sticky",
    top: 0,
    zIndex: 999,
    boxShadow: "0 2px 0 rgba(0, 0, 0, 0.08)",
  };

  return (
    <Layout.Header style={headerStyles}>
      <Space align="center" size="middle">
        <CurrentUser />
      </Space>
    </Layout.Header>
  );
};
