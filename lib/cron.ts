import { Client } from "@upstash/qstash";

const client = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export async function setupCronJob() {
  try {
    // Tạo cron job chạy mỗi giờ
    const response = await client.schedules.create({
      destination: `${
        process.env.VERCEL_URL || "http://localhost:3000"
      }/api/cron`,
      cron: "0 * * * *", // Chạy mỗi giờ
    });

    console.log("Cron job created:", response);
    return response;
  } catch (error) {
    console.error("Error creating cron job:", error);
    throw error;
  }
}

// Các pattern cron phổ biến:
// "0 * * * *"     - Mỗi giờ
// "0 0 * * *"     - Mỗi ngày lúc 12:00 AM
// "0 0 * * 1"     - Mỗi thứ 2 lúc 12:00 AM
// "*/15 * * * *"  - Mỗi 15 phút
// "0 0 1 * *"     - Ngày đầu tiên của mỗi tháng
