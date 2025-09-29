type SSEController = ReadableStreamDefaultController<Uint8Array>;
//SSE gửi dạng byte về => convert sang unit8array(mảng nhị phân 2 mũ 8)(8bit unsigned integers)0->255 tức 0 = 00000000 1->00000001

interface Connection {
  controller: SSEController;
  userId: string;
  createdAt: Date;
}
//userID,userconnection
const connection = new Map<string, Connection>();
//bookId,Set UserId
const bookFollow = new Map<number, Set<string>>();

function CleanUpConnection(userId: string) {
  const conn = connection.get(userId);
  if (conn) {
    try {
      conn.controller.close();
    } catch (error: unknown) {
      const err = error as Error;
      throw new Error("Can't clean up Connection", err);
    }
    connection.delete(userId);
    //xóa hết connect của user, ko còn thì mới xóa book
    bookFollow.forEach((users, bookId) => {
      users.delete(userId);
      if (users.size === 0) {
        bookFollow.delete(bookId);
      }
    });
  }
}

export function AddConnection(
  userId: string,
  controller: SSEController,
  bookId?: number
) {
  if (!userId) {
    throw new Error("Please provide userId");
  }
  CleanUpConnection(userId);
  const conn = connection.get(userId);
  if (!conn) {
    connection.set(userId, {
      userId,
      controller,
      createdAt: new Date(),
    });
  }
  if (bookId) {
    if (!bookFollow.has(bookId)) {
      bookFollow.set(bookId, new Set());
    }
    bookFollow.get(bookId)?.add(userId);
  }
  console.log(`Connected: ${userId}. Total: ${connection.size}`);
}
export function SendToUser(userId: string, event: string, data: any) {
  const conn = connection.get(userId);
  if (conn) {
    try {
      const encoder = new TextEncoder(); //chuyển string(event) sang unit8array(byte)
      // event: eventName \n =>data: {"key": "value"}\n\n (\n\n = kết thúc trong sse)
      const message = `event:${event}\ndata:${JSON.stringify(data)}\n\n`;
      //enqueue => thêm chunk vào hàng đợi, client nhận qua eventsrc(tức đẩy dữ liệu)
      conn.controller.enqueue(encoder.encode(message));
    } catch (err) {
      CleanUpConnection(userId);
      return false;
    }
  }
  return false;
}
export function broadcast(userIds: string[], event: string, data: unknown) {
  let sent = 0;
  userIds.forEach((userId) => {
    if (SendToUser(userId, event, data)) sent++;
  });
  console.log(`Broadcast: ${sent}/${userIds.length} sent`);
}
export function boardcastBook(bookId: number, event: string, data: unknown) {
  const followers = bookFollow.get(bookId);
  if (followers) {
    broadcast(Array.from(followers), event, data);
  } else {
    console.log("book doesnt have any follower");
    return;
  }
}

//bên import module phải chạy node runtime(edge runtime ko hỗ trợ setInterval)
setInterval(() => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); //1h
  connection.forEach((conn, userId) => {
    if (conn.createdAt < oneHourAgo) {
      CleanUpConnection(userId);
    }
  });
}, 5 * 60 * 1000); //5p
