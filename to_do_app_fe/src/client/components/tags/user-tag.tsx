import { Space, Tag } from "antd";
import React from "react";
import { CloseOutlined } from "@ant-design/icons"; // <-- import icon

import type { User } from "../../../../shared/types/interfaces";

import { CustomAvatar } from "../custom-avatar";

type Props = {
  user: User;
  onRemove?: () => void;
};

export const UserTag: React.FC<Props> = ({ user, onRemove }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <Tag
      key={user.id}
      style={{
        padding: 2,
        paddingRight: 8,
        borderRadius: 24,
        lineHeight: "unset",
        marginRight: "unset",
        position: 'relative',
        cursor: 'default',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Space size={4}>
        <CustomAvatar
          src={""}
          name={user.username}
          style={{ display: "inline-flex" }}
        />
        {user.username}
        {hover && typeof onRemove === 'function' && (
          <CloseOutlined
            style={{ marginLeft: 4, color: '#ff4d4f', cursor: 'pointer', fontWeight: 700 }}
            onClick={e => { e.stopPropagation(); onRemove(); }}
            title="Remove user"
          />
        )}
      </Space>
    </Tag>
  );
};
