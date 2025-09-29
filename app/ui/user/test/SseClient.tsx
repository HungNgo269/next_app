// app/sse-demo/SseClient.tsx
"use client";

import { formatDateTime } from "@/lib/utils/formatDate";
import { useEffect, useRef, useState } from "react";

export default function SseClient() {
  const [status, setStatus] = useState<"idle" | "open" | "error">("idle");
  const [ticks, setTicks] = useState<string[]>([]);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Kết nối SSE
    const es = new EventSource("/api/sse", { withCredentials: true });
    esRef.current = es;

    es.onopen = () => {
      setStatus("open");
    };

    es.onerror = () => {
      // Trình duyệt sẽ tự reconnect theo backoff; bạn có thể hiện "retrying..."
      setStatus("error");
    };

    // Lắng nghe event mặc định "message" (khi server không đặt 'event:')
    es.onmessage = (ev) => {
      // Không dùng trong ví dụ này (ta gửi có tên event)
      // console.log("message", ev.data);
    };

    // Lắng nghe event tên "hello"
    es.addEventListener("hello", (e: MessageEvent) => {
      const payload = JSON.parse(e.data);
      setTicks((prev) => [`hello: ${payload.message}`, ...prev].slice(0, 50));
    });

    // Lắng nghe event tên "tick"
    es.addEventListener("tick", (e: MessageEvent) => {
      const payload = JSON.parse(e.data) as { now: string; counter: number };
      setTicks((prev) =>
        [`#${payload.counter} — ${payload.now}`, ...prev].slice(0, 50)
      );
    });

    return () => {
      es.close(); // rất quan trọng để tránh rò rỉ kết nối khi unmount
      esRef.current = null;
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4 space-y-3">
      <div className="text-sm">
        SSE status:{" "}
        <span
          className={
            status === "open"
              ? "text-green-600"
              : status === "error"
              ? "text-red-600"
              : "text-gray-500"
          }
        ></span>
      </div>

      <div className="border rounded p-3 h-80 overflow-auto text-sm font-mono">
        {ticks.length === 0 ? (
          <div>Waiting for events…</div>
        ) : (
          ticks.map((t, i) => <div key={i}>{t}</div>)
        )}
      </div>
    </div>
  );
}
