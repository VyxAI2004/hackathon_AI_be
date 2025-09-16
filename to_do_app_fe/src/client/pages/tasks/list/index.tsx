import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { DragEndEvent } from "@dnd-kit/core";

import { KanbanAddCardButton } from "../components";
import { KanbanBoard, KanbanBoardContainer } from "./kanban/board";
import { ProjectCardMemo, ProjectCardSkeleton } from "./kanban/card";
import { KanbanColumn, KanbanColumnSkeleton } from "./kanban/column";
import { KanbanItem } from "./kanban/item";
import { getMyTasks, updateTask } from "../../../providers/data/task.api";
import type { Task } from "../../../../../shared/types/interfaces.d";
import { TasksCreatePage } from "../create";

export const TasksListPage: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stages = [
    { id: "pending", title: "Pending" },
    { id: "in_progress", title: "In Progress" },
    { id: "completed", title: "Completed" },
  ];

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await getMyTasks();
      setTasks(res.items);
    } catch {
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Reload tasks when returning to /tasks (after edit)
  useEffect(() => {
    if (location.pathname === "/tasks") {
      fetchTasks();
    }
  }, [location.pathname]);

  const handleEditTask = (taskId: string) => {
    navigate(`/tasks/edit/${taskId}`, { state: { onSuccess: fetchTasks } });
  };

  const handleOnDragEnd = async (event: DragEndEvent) => {
    const stageId = event.over?.id as string | null | undefined;
    const taskId = event.active.id as string;
    const taskStageId = event.active.data.current?.status;

    if (taskStageId === stageId) return;

    try {
      await updateTask(taskId, { status: stageId });
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: stageId || "pending" } : task
        )
      );
    } catch {}
  };

  const handleAddCard = ({ stageId }: { stageId: string }) => {
    navigate(`?stageId=${stageId}`, { replace: true });
    setIsModalOpen(true);
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
    setIsModalOpen(false);
    navigate("/tasks", { replace: true });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/tasks", { replace: true });
  };

  const handleTaskDeleted = (deletedId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== deletedId));
    fetchTasks();
  };


  // --- Search & Filter logic ---
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

  // Menu items for filter dropdown
  const filterMenuItems = [
    { key: "all", label: "All" },
    ...stages.map((s) => ({ key: s.id, label: s.title })),
  ];

  // Filtered and searched tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = !filterStatus || filterStatus === "all" || task.status === filterStatus;
    const matchesSearch = !searchKeyword || task.title?.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleFilterChange = (key: string) => {
    setFilterStatus(key);
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <>
      <KanbanBoard
        onDragEnd={handleOnDragEnd}
        filterMenuItems={filterMenuItems}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      >
        {stages.map((stage) => {
          const stageTasks = filteredTasks.filter((task) => task.status === stage.id);
          return (
            <KanbanColumn
              key={stage.id}
              id={stage.id}
              title={stage.title}
              count={stageTasks.length}
              onAddClick={() => handleAddCard({ stageId: stage.id })}
            >
              {stageTasks.length ? (
                stageTasks.map((task) => (
                  <KanbanItem key={task.id} id={task.id} data={task}>
                    <ProjectCardMemo
                      {...task}
                      dueDate={
                        task.due_date
                          ? typeof task.due_date === "string"
                            ? task.due_date
                            : task.due_date.toISOString()
                          : undefined
                      }
                      updatedAt={
                        task.updated_at
                          ? typeof task.updated_at === "string"
                            ? task.updated_at
                            : task.updated_at.toISOString()
                          : ""
                      }
                      assignedUsers={task.assignedUsers?.map(u => ({
                        id: u.id,
                        name: u.username || "",
                        avatar_url: u.avatar_url
                      }))}
                      onClick={() => handleEditTask(task.id)}
                      onDeleted={() => handleTaskDeleted(task.id)}
                    />
                  </KanbanItem>
                ))
              ) : (
                <KanbanAddCardButton
                  onClick={() => handleAddCard({ stageId: stage.id })}
                />
              )}
            </KanbanColumn>
          );
        })}
      </KanbanBoard>

      {isModalOpen && (
        <TasksCreatePage
          onSuccess={handleTaskCreated}
          onCancel={handleCloseModal}
        />
      )}

      {children}
    </>
  );
};

const PageSkeleton = () => {
  const columnCount = 3;
  const itemCount = 4;
  return (
    <KanbanBoardContainer>
      {Array.from({ length: columnCount }).map((_, idx) => (
        <KanbanColumnSkeleton key={idx}>
          {Array.from({ length: itemCount }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </KanbanColumnSkeleton>
      ))}
    </KanbanBoardContainer>
  );
};
