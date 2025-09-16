import React, { useState } from "react";
import { Card, Empty, Pagination } from "antd"; // Import Pagination từ Ant Design
import { CalendarOutlined } from "@ant-design/icons";

interface UpcomingEventsProps {
  events: any[];
  loading: boolean;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  // Tính toán dữ liệu cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = events.slice(indexOfFirstItem, indexOfLastItem);

  // Xử lý khi người dùng thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CalendarOutlined />
          <span>Upcoming Tasks</span>
        </div>
      }
      style={{ height: "100%", position: "relative" }} /* Thêm relative vào Card */
    >
      {loading ? (
        <div>Loading...</div>
      ) : events.length > 0 ? (
        <>
          <div>
            {currentEvents.map((task) => (
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
          {/* Component phân trang của Ant Design được cố định */}
          <div style={{ position: "absolute", bottom: 16, right: 24 }}>
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={events.length}
              onChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <Empty description="No Upcoming Tasks" style={{ padding: 30 }} />
      )}
    </Card>
  );
};