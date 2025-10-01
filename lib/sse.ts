import { GetUsersFollowBookAction } from "@/app/actions/bookFollowActions";

type SSEController = ReadableStreamDefaultController<Uint8Array>;
//SSE gửi dạng byte về => convert sang unit8array(mảng nhị phân 2 mũ 8)(8bit unsigned integers)0->255 tức 0 = 00000000 1->00000001

interface connections {
  controller: SSEController;
  userId: string;
  createdAt: Date;
}

// FIX: Sử dụng globalThis để đảm bảo singleton
declare global {
  var sseConnections: Map<string, connections> | undefined;
}

// Khởi tạo hoặc lấy existing Map từ global
const connections = globalThis.sseConnections ?? new Map<string, connections>();
globalThis.sseConnections = connections;

//userID,userconnection

function CleanUpConnection(userId: string) {
  const conn = connections.get(userId);
  if (conn) {
    conn.controller.close();
    connections.delete(userId);
  }
}

export function AddConnection(userId: string, controller: SSEController) {
  if (!userId) {
    throw new Error("Please provide userId");
  }
  const existingConn = connections.get(userId);
  if (existingConn) {
    CleanUpConnection(userId);
  }

  const newConnection: connections = {
    userId,
    controller,
    createdAt: new Date(),
  };
  connections.set(userId, newConnection);
}
export function SendToUser(userId: string, event: string, data: any) {
  const conn = connections.get(userId);
  if (conn) {
    try {
      const encoder = new TextEncoder(); //chuyển string(event) sang unit8array(byte)
      // event: eventName \n =>data: {"key": "value"}\n\n (\n\n = kết thúc trong sse)
      const message = `event:${event}\ndata:${JSON.stringify(data)}\n\n`;
      console.log("check message", message);
      //enqueue => thêm chunk vào hàng đợi, client nhận qua eventsrc(tức đẩy dữ liệu)
      conn.controller.enqueue(encoder.encode(message));
      return true;
    } catch (err) {
      CleanUpConnection(userId);
      return false;
    }
  }
  return false;
}
export function broadcast(userIds: string[], event: string, data: unknown) {
  userIds.forEach((userId) => {
    SendToUser(userId, event, data);
  });
}
export async function boardcastBook(
  bookId: number,
  event: string,
  data: unknown
) {
  const followers = await GetUsersFollowBookAction(bookId);
  if (followers) {
    broadcast(followers, event, data);
  } else {
    return;
  }
}

//bên import module phải chạy node runtime(edge runtime ko hỗ trợ setInterval)
setInterval(() => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); //1h
  connections.forEach((conn, userId) => {
    if (conn.createdAt < oneHourAgo) {
      CleanUpConnection(userId);
    }
  });
}, 5 * 60 * 1000); //5p
