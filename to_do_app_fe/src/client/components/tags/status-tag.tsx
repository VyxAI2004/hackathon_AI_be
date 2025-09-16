import React from "react";

import {
  CheckCircleOutlined,
  MinusCircleOutlined,
  PlayCircleFilled,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Tag, type TagProps } from "antd";

type Props = {
  status: "pending" | "in_progress" | "done" | string;
};

export const StatusTag = ({ status }: Props) => {
  let icon: React.ReactNode = null;
  let color: TagProps["color"] = undefined;

  switch (status) {
    case "pending":
      icon = <PlayCircleOutlined />;
      color = "cyan";
      break;
    case "in_progress":
      icon = <PlayCircleFilled />;
      color = "blue";
      break;
    case "done":
      icon = <CheckCircleOutlined />;
      color = "green";
      break;
    default:
      icon = <MinusCircleOutlined />;
      color = "default";
      break;
  }

  return (
    <Tag color={color} style={{ textTransform: "capitalize" }}>
      {icon} {status.toLowerCase()}
    </Tag>
  );
};
