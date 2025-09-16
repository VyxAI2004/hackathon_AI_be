import React from "react";
import { Layout as AntdLayout, Space, Button, theme, Grid } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { CurrentUser } from "../current-user"; // giữ nguyên nếu bạn có component này

const { Header: AntHeader } = AntdLayout;
const { useToken } = theme;
const { useBreakpoint } = Grid;

type Props = {
  onMenuClick?: () => void;
};

export const Header: React.FC<Props> = ({ onMenuClick }) => {
  const { token } = useToken();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <AntHeader
      style={{
        backgroundColor: token.Layout?.headerBg ?? "#0c1324",
        padding: "0 16px",
        height: 60,
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 999,
        boxShadow: "0 2px 0 rgba(0,0,0,0.08)",
      }}
    >
      {/* left area: menu button on mobile (reserve space so avatar stays right) */}
      <div style={{ minWidth: 48 }}>
        {isMobile && (
          <Button
            type="text"
            icon={<MenuOutlined style={{ color: "#fff", fontSize: 20 }} />}
            onClick={onMenuClick}
          />
        )}
      </div>

      {/* flexible middle (keeps avatar on the right) */}
      <div style={{ flex: 1 }} />

      {/* right area: current user / avatar */}
      <Space align="center">
        <CurrentUser />
      </Space>
    </AntHeader>
  );
};
