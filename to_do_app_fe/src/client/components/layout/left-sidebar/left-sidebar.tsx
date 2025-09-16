import React from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  CheckCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";

import logo from "../../../../../public/naver-logo.svg";
import logograph from "../../../../../public/hackathon-graphic.svg";

type Props = {
  onNavigate?: () => void;
};

export const LeftSidebar: React.FC<Props> = ({ onNavigate }) => {
  const items = [
    {
      key: "1",
      icon: <HomeOutlined style={{ fontSize: 16 }} />,
      style: { fontWeight: 600 },
      label: (
        <NavLink to="/" onClick={() => onNavigate?.()}>
          Dashboard
        </NavLink>
      ),
    },
    {
      key: "2",
      icon: <CheckCircleOutlined style={{ fontSize: 16 }} />,
      style: { fontWeight: 600 },
      label: (
        <NavLink to="/tasks" onClick={() => onNavigate?.()}>
          Tasks
        </NavLink>
      ),
    },
    {
      key: "3",
      icon: <SettingOutlined style={{ fontSize: 16 }} />,
      style: { fontWeight: 600 },
      label: (
        <NavLink to="/settings" onClick={() => onNavigate?.()}>
          Settings
        </NavLink>
      ),
    },
  ];

  return (
    <aside
      style={{
        width: 230,
        backgroundColor: "#0c1324",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* logo area */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: 60,
          paddingLeft: 16,
        }}
      >
        <img src={logograph} alt="Logo Graphic" style={{ height: 30, width: 30 }} />
        <img src={logo} alt="Logo" style={{ height: 30, width: 120 }} />
      </div>

      {/* menu */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <Menu
          mode="inline"
          theme="dark"
          defaultSelectedKeys={["1"]}
          items={items}
          style={{ borderRight: 0, background: "transparent" }}
        />
      </div>
    </aside>
  );
};  