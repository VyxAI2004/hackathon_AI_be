import React, { useState, useEffect } from "react";
import { Input, Skeleton, message, Typography } from "antd";
import { updateTask } from "../../../../../providers/data/task.api";

type Props = {
  taskId: string;
  title?: string;
  onSuccess: (updatedTask: any) => void;
};

export const TitleForm: React.FC<Props> = ({ taskId, title, onSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentTitle(title);
  }, [title]);

  const handleSave = async (newTitle: string) => {
    if (newTitle === currentTitle) {
      setIsEditing(false);
      return;
    }

    if (!newTitle.trim()) {
      message.error("Title cannot be empty.");
      return;
    }

    setIsLoading(true);
    try {
      const updatedTask = await updateTask(taskId, { title: newTitle });
      message.success("Update title successfully!");
      setCurrentTitle(newTitle);
      onSuccess(updatedTask);
    } catch (error) {
      message.error("Update title failed!");
      setCurrentTitle(title);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    handleSave(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave(e.currentTarget.value);
    }
  };

  if (isLoading) {
    return (
      <Skeleton.Input
        size="small"
        style={{ width: "95%", height: "22px" }}
        active
      />
    );
  }

  return (
    <div style={{ padding: "0 12px" }}>
      {isEditing ? (
        <Input
          value={currentTitle}
          onChange={(e) => setCurrentTitle(e.target.value)}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          bordered={false}
          style={{ padding: 0 }}
        />
      ) : (
        <Typography.Paragraph
          onClick={handleTitleClick}
          ellipsis={{ rows: 1 }}
          style={{ cursor: "pointer", fontSize: "20px", marginBottom: 0 }}
        >
          {currentTitle || "Click to add a title"}
        </Typography.Paragraph>
      )}
    </div>
  );
};