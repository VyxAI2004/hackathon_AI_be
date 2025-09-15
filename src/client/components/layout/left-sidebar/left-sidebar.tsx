import React, { useState, useEffect } from "react";
import { Drawer, Button, Menu } from "antd";
import { HomeOutlined, CheckCircleOutlined, SettingOutlined, MenuOutlined } from "@ant-design/icons";
import logo from '../../../../../public/naver-logo.svg';
import logograph from '../../../../../public/hackathon-graphic.svg';
import { NavLink } from "react-router-dom";

export const LeftSidebar: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { key: "1", icon: <HomeOutlined />, label: <NavLink to="/">Dashboard</NavLink> },
    { key: "2", icon: <CheckCircleOutlined />, label: <NavLink to="/tasks">Tasks</NavLink> },
    { key: "3", icon: <SettingOutlined />, label: <NavLink to="/settings">Settings</NavLink> },
  ];

  if (!isMobile) {
    return (
      <div style={{ width: 230, backgroundColor: "#0c1324ff", minHeight: "100vh", position: "sticky", top: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, height: 60, paddingLeft: 16 }}>
          <img src={logograph} alt="Logo Graphic" style={{ height: 30, width: 30 }} />
          <img src={logo} alt="Logo" style={{ height: 30, width: 120 }} />
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} items={menuItems} style={{ marginTop: 8 }} />
      </div>
    );
  }

  return (
    <>
      {/* Mobile Menu Icon */}
      <div className="mobile-header" style={{
        display: "flex",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "#0c1324ff",
        height: 60,
        alignItems: "center",
        padding: "0 16px",
      }}>
        <Button
          type="text"
          icon={<MenuOutlined style={{ color: "#fff", fontSize: 24 }} />}
          onClick={() => setDrawerVisible(true)}
        />
      </div>

      <Drawer
        placement="left"
        closable={false}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        bodyStyle={{ padding: 0, backgroundColor: "#0c1324ff" }}
        width={230}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#0c1324ff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, height: 60, paddingLeft: 16 }}>
            <img src={logograph} alt="Logo Graphic" style={{ height: 30, width: 30 }} />
            <img src={logo} alt="Logo" style={{ height: 30, width: 120 }} />
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} items={menuItems} onClick={() => setDrawerVisible(false)} />
        </div>
      </Drawer>
    </>
  );
};
