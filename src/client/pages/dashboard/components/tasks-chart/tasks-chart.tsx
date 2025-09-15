import React from "react";
import { Card, Empty, Spin } from "antd";
import { Column, type ColumnConfig } from "@ant-design/plots";
import { BarChartOutlined } from "@ant-design/icons";

interface Task {
  id: string;
  title: string;
  status: string;
  due_date?: string;
}

interface TaskBarChartProps {
  events: Task[];
  loading: boolean;
}

const TaskBarChart: React.FC<TaskBarChartProps> = ({ events, loading }) => {
  // Gom nhóm theo status và đếm số lượng
  const chartData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((t) => {
      counts[t.status] = (counts[t.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [events]);

const config: ColumnConfig = {
  data: chartData,
  xField: "status",
  yField: "count",
  colorField: "status",
  padding: [5, 5, 5, 5], // Thêm khoảng đệm 50px ở phía trên
  scale: {
    color: {
      domain: ["pending", "in_progress", "completed"],
      range: ["#5eb1ff", "#FF6B81", "#5FF281"],
    },
  },
  legend: {
    position: "top",
    itemSpacing: 20,
  },
  columnStyle: { radius: [4, 4, 0, 0] },
  label: {
    position: "middle",
    style: { fill: "#fff", fontSize: 12 },
  },
};

  return (
    <Card
      style={{ height: "100%" }}
      headStyle={{ padding: "8px 16px" }}
      bodyStyle={{ padding: "24px 24px 0px 24px" }}
      title={
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <BarChartOutlined />
          <span style={{ marginLeft: ".5rem" }}>Tasks</span>
        </span>
      }
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin />
        </div>
      ) : chartData.length === 0 ? (
        <Empty description="No task data" style={{ padding: 30 }} />
      ) : (
        <Column {...config} height={325} />
      )}
    </Card>
  );
};

export default TaskBarChart;