import React from "react";
import { Card, Skeleton } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

type TaskStatus = "pending" | "in_progress" | "completed";

interface Props {
  stats: Record<TaskStatus, number>;
  isLoading?: boolean;
}

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    color: "#5eb1ff",
    icon: <ClockCircleOutlined style={{ color: "#5eb1ff", fontSize: 28 }} />,
  },
  in_progress: {
    label: "In Progress",
    color: "#FF6B81",
    icon: <SyncOutlined style={{ color: "#FF6B81", fontSize: 28 }} spin />,
  },
  completed: {
    label: "Completed",
    color: "#03ef62",
    icon: <CheckCircleOutlined style={{ color: "#03ef62", fontSize: 28 }} />,
  },
};

const IconWrapper: React.FC<
  React.PropsWithChildren<{ color: string }>
> = ({ color, children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 36,
      height: 36,
      borderRadius: "50%",
      backgroundColor: color,
    }}
  >
    {children}
  </div>
);

export const SingleTaskStatusCard: React.FC<{
  status: TaskStatus;
  stats: Record<TaskStatus, number>;
  isLoading?: boolean;
}> = ({ status, stats, isLoading = false }) => {
  const { label, color, icon } = STATUS_CONFIG[status];

  const chartData = [
    { day: "Mon", value: Math.floor(Math.random() * 10) },
    { day: "Tue", value: Math.floor(Math.random() * 10) },
    { day: "Wed", value: Math.floor(Math.random() * 10) },
    { day: "Thu", value: Math.floor(Math.random() * 10) },
    { day: "Fri", value: Math.floor(Math.random() * 10) },
  ];

  return (
<Card
  size="small"
  style={{ height: "120px", background: "#0f172a", padding: 4 }}
  bodyStyle={{ padding: "8px 8px 8px 12px" }}
>
  {/* Hàng trên: icon + label */}
  <div style={{ display: "flex", alignItems: "center", gap: 16}}>
    <IconWrapper color={`${color}33`}>{icon}</IconWrapper>
    <span style={{ color, fontWeight: 600, fontSize: 14 }}>{label}</span>
  </div>

  {/* Hàng dưới: number + line chart */}
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <span
      style={{
        flex: 1,
        marginLeft: "50px",
        fontSize: 42,
        fontWeight: 600,
        color,
      }}
    >
      {isLoading ? <Skeleton.Input active size="small" /> : stats[status] ?? 0}
    </span>

    <ResponsiveContainer width="70%" height={40}>
      <LineChart data={chartData}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
</Card>

  );
};

export const TaskPieChartCard: React.FC<Props> = ({
  stats,
  isLoading = false,
}) => {
  const total =
    (stats.pending ?? 0) +
    (stats.in_progress ?? 0) +
    (stats.completed ?? 0);

  const data = (Object.keys(STATUS_CONFIG) as TaskStatus[]).map((status) => ({
    name: STATUS_CONFIG[status].label,
    value: stats[status] ?? 0,
    color: STATUS_CONFIG[status].color,
  }));

  return (
    <Card
      size="small"
      style={{
        flex: 1,
        minWidth: 200,
        background: "#0f172a",
      }}
      bodyStyle={{ padding: 24 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <PieChartOutlined style={{ color: "#03ef62", fontSize: 18 }} />
        <h4 style={{ color: "#fff", margin: 0 }}>Tasks Distribution</h4>
      </div>

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <ResponsiveContainer width="100%" height={358}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={(props: any) => `${(props.percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}

      <div style={{ color: "#aaa" }}>
        Total: <strong style={{ color: "#fff" }}>{total}</strong>
      </div>
    </Card>
  );
};
