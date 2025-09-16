import { useState, useEffect } from "react";
import { Button, Modal, Skeleton, message } from "antd";
import {
  AlignLeftOutlined,
  DeleteOutlined,
  FieldTimeOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Accordion } from "../../../components";
import { DescriptionHeader } from "./forms/description/description-header";
import { DueDateHeader } from "./forms/due-date/duedate-header";
import { UsersHeader } from "./forms/users/users-header";
import { getTask, deleteTask, updateTask, assignTask, unassignTask } from "../../../providers/data/task.api";
import type { Task, User } from "../../../../../shared/types/interfaces.d";
import { UsersForm } from "./forms/users/users-form";
import DescriptionForm from "./forms/description/description-form";
import DueDateForm from "./forms/due-date/duedate-form";
import StageForm from "./forms/stage/stage-form";
import { useLocation, useNavigate } from "react-router-dom";

export const TasksEditPage = () => {  
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState<string | undefined>();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState("");
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>([]);

  const taskId = window.location.pathname.split("/").pop();

  useEffect(() => {
    const fetchTask = async () => {
      setIsLoading(true);
      try {
        if (taskId) {
          const res = await getTask(taskId);
          setTask(res ?? null);
          setTitle(res?.title || "");
          setDescription(res?.description || "");
          setDueDate(res?.due_date ? (typeof res.due_date === "string" ? res.due_date : res.due_date.toISOString()) : undefined);
          setStatus(res?.status || "");
          // Luôn đồng bộ assignedUserIds từ task.assignedUsers nếu có
          let ids: string[] = [];
          if (Array.isArray(res?.assignedUsers)) {
            ids = res.assignedUsers.map((u: any) => u.id);
          } else if (Array.isArray(res?.assigned_to)) {
            if (typeof res.assigned_to[0] === "object" && res.assigned_to[0] !== null) {
              ids = res.assigned_to.map((u: any) => u.id);
            } else {
              ids = res.assigned_to as string[];
            }
          } else if (res?.assigned_to) {
            ids = [typeof res.assigned_to === "object" ? res.assigned_to.id : res.assigned_to];
          }
          setAssignedUserIds(ids);
        }
      } catch (error) {
        setTask(null);
        message.error("Failed to load task.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  const handleDelete = async () => {
    if (!taskId) return;
    try {
      await deleteTask(taskId);
      message.success("Task deleted successfully!");
      navigate("/tasks"); 
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || "Failed to delete task.");
    }
  };


  if (isLoading || !task) {
    return (
      <Modal
        open={true}
        footer={null}
        onCancel={() => navigate("/tasks")}
      >
        <Skeleton active />
      </Modal>
    );
  }

  return (
    <Modal
      className="kanban-update-modal"
      open={true}
      onCancel={() => navigate("/tasks")}
      title={
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ fontSize: 20, fontWeight: 600, width: "100%", border: "none", background: "transparent" }}
        />
      }
      width={586}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
          >
            Delete card
          </Button>
          <Button
            type="primary"
            onClick={async () => {
              try {
                setIsLoading(true);
                // Update main fields
                await updateTask(taskId!, {
                  title,
                  description,
                  due_date: dueDate,
                  status,
                });
                // Update assigned users if changed
                await assignTask(taskId!, assignedUserIds);
                // Reload task state
                const res = await getTask(taskId!);
                setTask(res ?? null);
                message.success("Task updated successfully!");
                location.state?.onSuccess?.();
                navigate("/tasks");
              } catch (error) {
                message.error("Failed to update task");
              } finally {
                setIsLoading(false);
              }
            }}
          >
            Save
          </Button>
        </div>
      }
    >
      {/* Stage Form */}
      <StageForm
        status={status}
        completed={status === "done"}
        onChange={setStatus}
      />

      {/* Description Accordion */}
      <Accordion
        accordionKey="description"
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={<DescriptionHeader description={description} />}
        isLoading={isLoading}
        icon={<AlignLeftOutlined />}
        label="Description"
      >
        <DescriptionForm
          description={description}
          onChange={setDescription}
        />
      </Accordion>

      {/* Due Date Accordion */}
      <Accordion
        accordionKey="due-date"
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={
          <DueDateHeader
            dueDate={dueDate}
            taskId={taskId!}
            cancelForm={() => setActiveKey(undefined)}
          />
        }
        isLoading={isLoading}
        icon={<FieldTimeOutlined />}
        label="Due date"
      >
        <DueDateForm
          dueDate={dueDate}
          onChange={setDueDate}
        />
      </Accordion>

      {/* Users Accordion */}
      <Accordion
        accordionKey="users"
        activeKey={activeKey}
        setActive={setActiveKey}
        fallback={
          <UsersHeader
            users={task.assignedUsers ? task.assignedUsers : []}
            onRemoveUser={async (userId: string) => {
              if (!taskId) return;
              await unassignTask(taskId, userId);
              // Sau khi xóa, reload lại task để đồng bộ UI
              const res = await getTask(taskId);
              setTask(res ?? null);
              // Cập nhật lại assignedUserIds từ task mới
              if (res?.assignedUsers) {
                setAssignedUserIds(res.assignedUsers.map((u: any) => u.id));
              }
            }}
          />
        }
        isLoading={isLoading}
        icon={<UsergroupAddOutlined />}
        label="Users"
      >
        <UsersForm
          assignedUserIds={assignedUserIds}
          onChange={setAssignedUserIds}
        />
      </Accordion>
    </Modal>
  );
};
