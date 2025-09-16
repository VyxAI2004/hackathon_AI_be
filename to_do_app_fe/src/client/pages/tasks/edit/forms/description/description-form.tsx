import MDEditor from "@uiw/react-md-editor";
import { Form } from "antd";

type Props = {
  description: string;
  onChange: (desc: string) => void;
};

const DescriptionForm: React.FC<Props> = ({ description, onChange }) => {
  return (
    <Form layout="vertical">
      <Form.Item label="Description">
        <MDEditor
          value={description}
          onChange={v => onChange(v || "")}
          preview="edit"
          data-color-mode="light"
          height={250}
        />
      </Form.Item>
    </Form>
  );
};

export default DescriptionForm;
