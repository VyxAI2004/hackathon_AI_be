import React from "react";
import { Card, Empty  } from "antd";
import { CalendarOutlined } from "@ant-design/icons";

interface UpcomingEventsProps {
  events: any[];
  loading: boolean;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, loading }) => {
  // Hàm format ngày
  const formatDate = (d?: any) => {
    if (!d) return "No Date";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "No Date";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  // Màu tròn theo trạng thái
  const getTaskColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#5eb1ff";
      case "in_progress":
        return "#FF6B81";
      case "done":
      case "completed":
        return "#03ef62";
      default:
        return "#d9d9d9";
    }
  };

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CalendarOutlined />
          <span>Upcoming Tasks</span>
        </div>
      }
      style={{ height: "100%" }}
    >
      {loading ? (
        <div>Loading...</div>
      ) : events.length > 0 ? (
        <div>
          {events.map((task) => (
            <div
              key={task.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: 16,
              }}
            >
              {/* Tròn màu */}
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: getTaskColor(task.status),
                  marginRight: 10,
                  marginTop: 6,
                }}
              />
              <div>
                {/* Ngày nhỏ */}
                <div style={{ fontSize: 13, color: "#888" }}>
                  {formatDate(task.due_date)}
                </div>
                {/* Title */}
                <div style={{ fontWeight: 600, fontSize: 15, color: "#333" }}>
                  {task.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
      <Empty description="No Upcoming Tasks" style={{ padding: 30 }} />
    )}
    </Card>
  );
};
