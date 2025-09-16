import { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  UsergroupAddOutlined,
  AlignLeftOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Button,
  Card,
  ConfigProvider,
  Dropdown,
  Space,
  Tag,
  Row,
  Col,
  theme,
  message,
  Skeleton,
} from "antd";
import dayjs from "dayjs";
import { Text } from "../../../../components";
import { UserTag } from "../../../../components/tags/user-tag";
import type { User } from "../../../../../../shared/types/interfaces.d";
import { getDateColor } from "../../../../utilities";
import { deleteTask } from "../../../../providers/data/task.api";

type ProjectCardProps = {
  id: string;
  title: string;
  updatedAt: string;
  dueDate?: string;
  description?: string;
  status?: string;
  assignedUsers?: {
    id: string;
    name: string;
    avatar_url?: User["avatar_url"];
  }[];
  onClick?: () => void;
  onDeleted?: () => void;
};

export const ProjectCard = ({
  id,
  title,
  dueDate,
  description,
  status,
  assignedUsers,
  onClick,
  onDeleted,
}: ProjectCardProps) => {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const handleView = () => navigate(`/tasks/edit/${id}`);

  const handleDelete = async () => {
    try {
      await deleteTask(id);
      message.success("Đã xóa công việc!");
      if (onDeleted) onDeleted();
    } catch {
      message.error("Xóa công việc thất bại!");
    }
  };

  const dropdownItems = useMemo<MenuProps["items"]>(
    () => [
      { label: "Edit card", key: "1", icon: <EyeOutlined />, onClick: handleView },
      { label: "Delete card", key: "2", icon: <DeleteOutlined />, danger: true, onClick: handleDelete },
    ],
    [handleDelete]
  );

  const dueDateOptions = useMemo(() => {
    if (!dueDate) return null;
    const date = dayjs(dueDate);
    return { color: getDateColor({ date: dueDate }) as string, text: date.format("MMM D") };
  }, [dueDate]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Tag: { colorText: token.colorTextSecondary },
          Card: { headerBg: "transparent" },
        },
      }}
    >
      <Card
        size="small"
        title={<Text ellipsis={{ tooltip: title }}>{title}</Text>}
        onClick={onClick || handleView}
        bodyStyle={{ padding: "16px", width: "100%" }}
        style={{ width: "97%", margin: "0 auto" }}
        extra={
          <Dropdown
            trigger={["click"]}
            menu={{ items: dropdownItems }}
            placement="bottom"
            arrow={{ pointAtCenter: true }}
          >
            <Button
              type="text"
              shape="circle"
              icon={<MoreOutlined style={{ transform: "rotate(90deg)" }} />}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        }
      >
        <Space direction="vertical" style={{ width: "100%", gap: 12 }}>
          {/* Due Date */}
          {dueDateOptions && (
            <Row
              align="middle"
              gutter={4}
              style={{
                paddingBottom: "8px",
                borderBottom: "1px solid #eee",
                width: "100%",
              }}
            >
              <Col span={8} style={{ display: "flex", alignItems: "center", gap: 4, padding: 0 }}>
                <ClockCircleOutlined />
                <span style={{ fontWeight: 600 }}>Due Date</span>
              </Col>
              <Col
                span={16}
                style={{
                  padding: 0,
                  textAlign: "right",
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                }}
              >
                <Tag
                  color={dueDateOptions.color}
                  bordered={dueDateOptions.color !== "default"}
                  style={{
                    padding: "0 4px",
                    backgroundColor: dueDateOptions.color === "default" ? "transparent" : "unset",
                  }}
                >
                  {dueDateOptions.text}
                </Tag>
              </Col>
            </Row>
          )}

          {/* Description */}
          {description && (
            <Row
              align="middle"
              gutter={4}
              style={{
                paddingBottom: "8px",
                borderBottom: "1px solid #eee",
                width: "100%",
              }}
            >
              <Col span={8} style={{ display: "flex", alignItems: "center", gap: 4, padding: 0 }}>
                <AlignLeftOutlined />
                <span style={{ fontWeight: 600 }}>Description</span>
              </Col>
              <Col
                span={16}
                style={{
                  padding: 0,
                  textAlign: "right",
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: token.colorTextSecondary,
                  fontWeight: 600,
                  width: "65%", // nội dung chiếm 65%
                }}
              >
                {description}
              </Col>
            </Row>
          )}

          {/* Users */}
          {assignedUsers && assignedUsers.length > 0 && (
            <Row
              align="middle"
              gutter={4}
              style={{
                paddingBottom: "4px",
                width: "100%",
              }}
            >
              <Col span={8} style={{ display: "flex", alignItems: "center", gap: 4, padding: 0 }}>
                <UsergroupAddOutlined />
                <span style={{ fontWeight: 600 }}>Users</span>
              </Col>
              <Col span={16} style={{ padding: 0 }}>
                <Space
                  size={[0, 6]}
                  wrap
                  style={{ justifyContent: "flex-end", flexDirection: "row-reverse", width: "65%" }}
                >
                  {assignedUsers.map((user) => (
                    <UserTag
                      key={user.id}
                      user={{
                        id: user.id,
                        username: user.name,
                        avatar_url: user.avatar_url,
                        email: "",
                        password_hash: "",
                        created_at: new Date(),
                        updated_at: new Date(),
                      }}
                    />
                  ))}
                </Space>
              </Col>
            </Row>
          )}
        </Space>
      </Card>
    </ConfigProvider>
  );
};

// Skeleton
export const ProjectCardSkeleton = () => (
  <Card size="small" bodyStyle={{ display: "flex", justifyContent: "center", gap: 8 }}>
    <Skeleton.Button active size="small" style={{ width: "200px", height: "22px" }} />
    <Skeleton.Button active size="small" style={{ width: "200px" }} />
    <Skeleton.Avatar active size="small" />
  </Card>
);

// Memo
export const ProjectCardMemo = memo(ProjectCard, (prev, next) =>
  prev.id === next.id &&
  prev.title === next.title &&
  prev.dueDate === next.dueDate &&
  prev.updatedAt === next.updatedAt
);
