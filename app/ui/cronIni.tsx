"use client";
import { useEffect } from "react";

export default function CronInitializer() {
  useEffect(() => {
    const initCron = async () => {
      try {
        await fetch("/api/cron/setup-cron", { method: "POST" });
      } catch (error) {
        console.error("Failed to init cron:", error);
      }
    };

    initCron();
  }, []);

  return null;
}
