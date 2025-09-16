import { CloseOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, Form, Input, Spin } from "antd";
import type { User } from "../../../../../shared/types/interfaces";
import { getUser, updateUser } from "../../../providers/data/user.api";
import { getNameInitials } from "../../../utilities";
import { CustomAvatar } from "../../custom-avatar";
import { Text } from "../../text";
import { useLogout } from "@refinedev/core";
import React from "react";

type Props = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  userId: string;
};

export const AccountSettings = ({ opened, setOpened, userId }: Props) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();
  const { mutate: logout } = useLogout();

  React.useEffect(() => {
    if (opened && userId) {
      setLoading(true);
      getUser(userId)
        .then((data) => {
          setUser(data);
          form.setFieldsValue({ name: data.username, email: data.email });
        })
        .finally(() => setLoading(false));
    }
  }, [opened, userId]);

  const closeModal = () => {
    setOpened(false);
  };

  const handleSave = async () => {
    const values = form.getFieldsValue();
    setLoading(true);
    await updateUser(userId, {
      username: values.name,
      email: values.email,
    });
    setLoading(false);
    setOpened(false);
  };

  const handleLogout = () => {
    logout();
    setOpened(false);
  };

  if (loading) {
    return (
      <Drawer
        open={opened}
        width={756}
        styles={{
          body: {
            background: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Spin />
      </Drawer>
    );
  }

  return (
    <Drawer
      onClose={closeModal}
      open={opened}
      width={756}
      styles={{
        body: { background: "#f5f5f5", padding: 0 },
        header: { display: "none" },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          backgroundColor: "#fff",
        }}
      >
        <Text strong>Account Settings</Text>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={closeModal}
        />
      </div>
      <div style={{ padding: "16px" }}>
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{ name: user?.username, email: user?.email }}
          >
            <CustomAvatar
              shape="square"
              src={user?.avatar_url}
              name={getNameInitials(user?.username || "")}
              style={{
                width: 96,
                height: 96,
                marginBottom: "24px",
              }}
            />
            <Form.Item label="Name" name="name">
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input placeholder="email" />
            </Form.Item>
            <Form.Item>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button
                  type="default"
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  style={{ color: "#ff4d4f" }}
                >
                  Logout
                </Button>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Drawer>
  );
};