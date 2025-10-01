"use client";

import { useEffect, useRef, useState } from "react";

interface props {
  userId: string;
}
export default function NotificationReceiver({ userId }: props) {
  const [status, setStatus] = useState<"idle" | "open" | "error">("idle");
  const [ticks, setTicks] = useState<string[]>([]);
  const esRef = useRef<EventSource | null>(null);
  useEffect(() => {
    const es = new EventSource(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/sse?userId=${userId}`
    );
    esRef.current = es;

    es.onopen = () => {
      setStatus("open");
    };

    es.onerror = () => {
      setStatus("error");
    };

    es.addEventListener("new_chapter", (e: MessageEvent) => {
      const payload = JSON.parse(e.data);
      console.log("payload", payload);
      setTicks((prev) => [`new_chapter: ${payload}`, ...prev].slice(0, 50));
    });

    return () => {
      es.close();
      esRef.current = null;
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4 space-y-3 mt-72">
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

      <div className="border rounded p-3 h-80 overflow-auto text-sm ">
        {ticks.length === 0 ? (
          <div>Waiting for events…</div>
        ) : (
          ticks.map((t, i) => <div key={i}>{t}</div>)
        )}
      </div>
    </div>
  );
}
