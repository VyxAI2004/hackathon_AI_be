// Trong file src/client/pages/tasks/create/index.tsx

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Form, Input, Modal, message } from "antd";
import type { Task } from "../../../../../shared/types/interfaces.d";

import { createTask } from "../../../providers/data/task.api";

//  Thêm onCancel vào props để xử lý khi người dùng đóng modal
export const TasksCreatePage: React.FC<{ onSuccess: (task: Task) => void; onCancel: () => void }> = ({ onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: Pick<Task, "title" | "description" | "status">) => {
    setLoading(true);
    try {
      const newTask = await createTask({
        title: values.title,
        status: searchParams.get("stageId") || "pending",
        description: values.description || ""
      });
      message.success("Task created successfully");
      onSuccess(newTask); 
    } catch (error) {
      message.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={true} 
      onCancel={onCancel} 
      title="Add new card"
      width={512}
      okText="Create"
      confirmLoading={loading}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          status: searchParams.get("stageId") || "pending"
        }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input disabled={loading} />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea disabled={loading} rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};