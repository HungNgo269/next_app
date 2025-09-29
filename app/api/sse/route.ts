import { AddConnection } from "@/lib/sse";
import type { NextRequest } from "next/server";

// Bắt buộc Node runtime để flush theo chunk (Edge cũng làm được,
// nhưng Node dễ kiểm soát hơn cho SSE demo)
export const runtime = "nodejs";
function sseHeaders() {
  return {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  };
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") ?? "";
  const bookId = req.nextUrl.searchParams.get("bookId") ?? "";
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: string) => {
        controller.enqueue(encoder.encode(payload));
      };
      AddConnection(userId, controller, parseInt(bookId));
      // Heartbeat để giữ kết nối (dòng comment ":" không bị trình duyệt hiển thị)
      const heartbeat = setInterval(() => {
        send(`: heartbeat ${Date.now()}\n\n`);
      }, 15_000);

      // Đóng khi client hủy (đổi trang/tab)
      const abort = () => {
        clearInterval(heartbeat);
        try {
          controller.close();
        } catch {}
      };
      req.signal.addEventListener("abort", abort);
    },
  });

  return new Response(stream, {
    headers: sseHeaders(),
  });
}
