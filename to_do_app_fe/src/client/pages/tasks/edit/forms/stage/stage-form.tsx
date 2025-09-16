import { FlagOutlined } from "@ant-design/icons";
import { Checkbox, Form, Select, Space } from "antd";
import { useState } from "react";
// import { updateTask } from "../../../../../providers/data/task.api";
// import type { Task } from "../../../../../../../shared/types/interfaces.d";

type Props = {
  status?: string;
  completed?: boolean;
  onChange: (status: string) => void;
};

const StageForm: React.FC<Props> = ({ status = "pending", completed = false, onChange }) => {
  const [stage, setStage] = useState(status);
  const [isCompleted, setIsCompleted] = useState(completed);

  const { Option } = Select;

  const STAGE_COLORS: Record<string, { background: string; color: string }> = {
    pending: { background: "#e6f5ff", color: "#0055a5ff" },
    in_progress: { background: "#ffe6eb", color: "#a80019ff" },
    completed: { background: "#e6fff3", color: "#008d21ff" },
  };

  const getStageStyle = (stageValue: string) =>
    STAGE_COLORS[stageValue] || { background: "#f0f0f0", color: "#000" };

  return (
    <div style={{ padding: "12px 24px", borderBottom: "1px solid #d9d9d9" }}>
      <Form layout="inline" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <Space size={5}>
          <FlagOutlined />
          <Form.Item noStyle>
            <Select
              value={stage}
              onChange={value => {
                setStage(value);
                onChange(value);
              }}
              bordered={false}
              showSearch={false}
              placeholder="Select a stage"
              size="small"
              style={{
                width: 120,
                ...getStageStyle(stage),
                fontWeight: 600,
                borderRadius: 4,
                padding: "0 8px",
              }}
            >
              <Option value="pending" style={{ ...getStageStyle("pending"), fontWeight: 600 }}>
                Pending
              </Option>
              <Option value="in_progress" style={{ ...getStageStyle("in_progress"), fontWeight: 600 }}>
                In Progress
              </Option>
              <Option value="completed" style={{ ...getStageStyle("completed"), fontWeight: 600 }}>
                Completed
              </Option>
            </Select>
          </Form.Item>
        </Space>

        <Form.Item noStyle>
          <Checkbox
            checked={isCompleted}
            onChange={e => {
              setIsCompleted(e.target.checked);
              if (e.target.checked) {
                setStage("completed");
                onChange("completed");
              }
            }}
          >
            Mark as complete
          </Checkbox>
        </Form.Item>

        {/* Save button removed, handled by parent */}
      </Form>
    </div>
  );
};

export default StageForm;