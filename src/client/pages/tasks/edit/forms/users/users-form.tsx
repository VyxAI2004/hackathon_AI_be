import React, { useEffect, useState } from "react";
import { Form, Select } from "antd";
import { getUsers } from "../../../../../providers/data/user.api"; 
import type { User } from "../../../../../../../shared/types/interfaces.d";

type Props = {
  assignedUserIds: string[];
  onChange: (ids: string[]) => void;
  assignedUsers?: User[]; 
};

export const UsersForm: React.FC<Props> = ({ assignedUserIds, onChange, assignedUsers = [] }) => {
  const [users, setUsers] = useState<User[]>(assignedUsers);
  const [usersLoading, setUsersLoading] = useState(users.length === 0);

  useEffect(() => {
    if (users.length > 0) return; // nếu đã có assignedUsers, không fetch
    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        const res = await getUsers();
        setUsers(res?.users || []);
      } catch {
        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const userMap = users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {} as Record<string, User>);

  return (
    <Form layout="vertical">
      <Form.Item label="Assigned Users">
        <Select
          mode="multiple"
          value={assignedUserIds}
          onChange={onChange}
          loading={usersLoading}
            options={users.map(user => ({
              label: user.username,
              value: user.id,
              disabled: assignedUserIds.includes(user.id)
            }))}
          tagRender={({ value, closable, onClose }) => {
            const user = userMap[value as string];
            return (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#f5f5f5', borderRadius: 4, padding: '0 6px', margin: 2 }}>
                {user?.avatar_url && <img src={user.avatar_url} alt={user.username} style={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover', marginRight: 2 }} />}
                {user?.username || value}
                {closable && <span style={{ marginLeft: 4, cursor: 'pointer' }} onClick={onClose}>&times;</span>}
              </span>
            );
          }}
        />
      </Form.Item>
    </Form>
  );
};