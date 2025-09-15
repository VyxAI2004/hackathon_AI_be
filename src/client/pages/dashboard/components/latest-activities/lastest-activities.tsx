import React from "react";
import dayjs from "dayjs";
import { getActivityLogsByUser } from "../../../../providers/data/activity-log";
import type { ActivityLog } from "../../../../../../shared/types/interfaces";
import { HistoryOutlined } from "@ant-design/icons";

type Props = { limit?: number };

export const LatestActivities: React.FC<Props> = ({ limit = 5 }) => {
  const [activities, setActivities] = React.useState<ActivityLog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [skip, setSkip] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);

  // Memoize the fetch function to ensure it's not recreated on every render
  const fetchData = React.useCallback(async () => {
    // Prevent fetching if already loading or no more data is available
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const { items } = await getActivityLogsByUser({
        skip: String(skip),
        limit: String(limit),
      });

      if (items.length < limit) {
        setHasMore(false); // If fetched items are less than limit, assume no more data
      }

      setActivities((prev) => [...prev, ...items]);
      setSkip((prev) => prev + items.length);
    } catch (error) {
      console.error("Failed to load activities:", error);
      setActivities([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, skip, limit]);

  // UseEffect to handle initial data fetch and limit prop changes
  React.useEffect(() => {
    // Reset state and perform initial fetch
    setActivities([]);
    setSkip(0);
    setHasMore(true);

    const initialFetch = async () => {
      setLoading(true);
      try {
        const { items } = await getActivityLogsByUser({
          skip: "0",
          limit: String(limit),
        });

        if (items.length < limit) {
          setHasMore(false);
        }
        setActivities(items);
        setSkip(items.length);
      } catch (error) {
        console.error("Failed to load initial activities:", error);
        setActivities([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    initialFetch();
  }, [limit]);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 8,
        padding: 24,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        minHeight: 200,
      }}
    >
      <h3
        style={{
          marginBottom: 16,
          color: "#333",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <HistoryOutlined />
        Latest Activities
      </h3>

      {activities.length === 0 && loading ? (
        <div>Loading...</div>
      ) : activities.length === 0 && !loading ? (
        <div style={{ color: "#888" }}>No activities found.</div>
      ) : (
        <>
          <div
            style={{
              maxHeight: 320,
              overflowY: "auto",
            }}
          >
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {activities.map((item) => (
                <li
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #eee",
                    padding: "12px 0",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span style={{ fontWeight: 600, color: "#1890ff" }}>
                    {item.user_id}
                  </span>
                  <span style={{ color: "#333" }}>
                    {item.action}
                    {item.target_type && (
                      <>
                        {" "}
                        on <b>{item.target_type}</b>
                      </>
                    )}
                    {item.target_id && <> (ID: {item.target_id})</>}
                  </span>
                  <span style={{ fontSize: 12, color: "#888" }}>
                    {dayjs(item.created_at).format("MMM DD, YYYY - HH:mm")}
                  </span>
                  {item.log_metadata && (
                    <span style={{ fontSize: 12, color: "#aaa" }}>
                      Metadata: {JSON.stringify(item.log_metadata)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {hasMore && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button
                onClick={fetchData}
                disabled={loading}
                style={{
                  padding: "8px 16px",
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  background: loading ? "#f0f0f0" : "#fff",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
