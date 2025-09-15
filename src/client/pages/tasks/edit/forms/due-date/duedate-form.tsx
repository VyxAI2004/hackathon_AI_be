import { DatePicker, Form } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
// import { updateTask } from "../../../../../providers/data/task.api";
// import type { Task } from "../../../../../../../shared/types/interfaces.d";

type Props = {
  dueDate?: string;
  onChange: (date: string | undefined) => void;
};

const DueDateForm: React.FC<Props> = ({ dueDate, onChange }) => {
  const [date, setDate] = useState<Dayjs | undefined>(dueDate ? dayjs(dueDate) : undefined);

  return (
    <Form layout="vertical">
      <Form.Item label="Due Date">
        <DatePicker
          format="YYYY-MM-DD HH:mm"
          showTime={{ showSecond: false, format: "HH:mm" }}
          style={{ backgroundColor: "#fff" }}
          value={date}
          onChange={d => {
            setDate(d || undefined);
            onChange(d ? d.toISOString() : undefined);
          }}
        />
      </Form.Item>
    </Form>
  );
};

export default DueDateForm;
