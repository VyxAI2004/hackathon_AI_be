import React, { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Input, Dropdown, Button, Space } from "antd";
import type { MenuProps } from "antd";
import { FilterOutlined } from "@ant-design/icons";

type KanbanBoardProps = {
  onDragEnd: (event: DragEndEvent) => void;
  filterMenuItems: MenuProps["items"];
  onSearch?: (keyword: string) => void;
  onFilterChange?: (key: string) => void;
};

export const KanbanBoard: React.FC<React.PropsWithChildren<KanbanBoardProps>> = ({
  onDragEnd,
  children,
  filterMenuItems,
  onSearch,
  onFilterChange,
}) => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 5 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { distance: 5 },
  });

  const sensors = useSensors(mouseSensor, touchSensor);
  const [keyword, setKeyword] = useState("");

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over === null) return;
    onDragEnd(event);
  };

const header = (
  <Space style={{ width: "98.2%", justifyContent: "flex-end", gap: 8 }}>
    <Input.Search
      placeholder="Search tasks..."
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      onSearch={(value) => onSearch?.(value)}
      style={{ width: 200 }} // bạn có thể điều chỉnh width
    />
    <Dropdown
      menu={{ items: filterMenuItems, onClick: (info) => onFilterChange?.(info.key) }}
    >
      <Button icon={<FilterOutlined />}>Filter</Button>
    </Dropdown>
  </Space>
);

  return (
    <KanbanBoardContainer header={header}>
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        {children}
      </DndContext>
    </KanbanBoardContainer>
  );
};

export const KanbanBoardContainer: React.FC<{
  header?: React.ReactNode;
  children: React.ReactNode;
}> = ({ header, children }) => {
  return (
    <div
      style={{
        width: "calc(100% + 64px)",
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        margin: "-32px",
      }}
    >
      {header && (
        <div style={{ padding: "32px", paddingBottom: 0 }}>{header}</div>
      )}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          padding: "32px",
          overflow: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
};
