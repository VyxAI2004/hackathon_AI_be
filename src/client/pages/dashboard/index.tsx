import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";

import { SingleTaskStatusCard } from "./components/total-count-card/total-count-card";
import { TaskPieChartCard } from "./components/total-count-card/total-count-card";
import { UpcomingEvents } from "./components/upcoming-events/upcoming-events";
import TaskBarChart from "./components/tasks-chart/tasks-chart";
import { LatestActivities } from "./components/latest-activities/lastest-activities";

import { getMyTasks } from "../../providers/data/task.api";

export const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ pending: number; in_progress: number; completed: number }>({
    pending: 0,
    in_progress: 0,
    completed: 0,
  });

  useEffect(() => {
    getMyTasks().then((data) => {
      const tasksData = data.items || [];
      setTasks(tasksData);
      setLoading(false);

      const stat = { pending: 0, in_progress: 0, completed: 0 };
      tasksData.forEach((task: any) => {
        let key: "pending" | "in_progress" | "completed" | undefined = undefined;
        if (task.status === "pending") key = "pending";
        else if (task.status === "in_progress") key = "in_progress";
        else if (task.status === "done" || task.status === "completed") key = "completed";
        if (key) stat[key] += 1;
      });
      setStats(stat);
    });
  }, []);

  return (
  <div
    className="page-container"
    style={{
      padding: "16px", // padding đều 16px
      width: "100%",
      marginLeft: 0, // chắc chắn không bị thụt
    }}
  >
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={8}>
        <SingleTaskStatusCard status="pending" stats={stats} isLoading={loading} />
      </Col>
      <Col xs={24} sm={12} md={8}>
        <SingleTaskStatusCard status="in_progress" stats={stats} isLoading={loading} />
      </Col>
      <Col xs={24} sm={12} md={8}>
        <SingleTaskStatusCard status="completed" stats={stats} isLoading={loading} />
      </Col>
    </Row>

    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
      <Col xs={24} sm={24} xl={8} style={{ minHeight: "460px" }}>
        <UpcomingEvents events={tasks} loading={loading} />
      </Col>
      <Col xs={24} sm={24} xl={8} style={{ minHeight: "460px" }}>
        <TaskBarChart events={tasks} loading={loading} />
      </Col>
      <Col xs={24} sm={24} xl={8} style={{ minHeight: "460px" }}>
        <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 16 }}>
          <TaskPieChartCard stats={stats} isLoading={loading} />
        </div>
      </Col>
    </Row>

    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
      <Col xs={24} sm={24}>
        <LatestActivities />
      </Col>
    </Row>
  </div>

  );
};
