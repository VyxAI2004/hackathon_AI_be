import { Space, Typography } from "antd";

import { UserTag } from "../../../../../components";
import type { User } from "../../../../../../../shared/types/interfaces.d";

type Props = {
  users?: User[];
  onRemoveUser?: (userId: string) => void;
};

export const UsersHeader = ({ users = [], onRemoveUser }: Props) => {
  if (users.length > 0) {
    return (
      <Space size={[0, 8]} wrap>
        {users.map((user) => (
          <UserTag key={user.id} user={user} onRemove={onRemoveUser ? () => onRemoveUser(user.id) : undefined} />
        ))}
      </Space>
    );
  }

  return <Typography.Link>Assign to users</Typography.Link>;
};
