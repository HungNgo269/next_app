import { cookies } from "next/headers";

export interface ReaderSettings {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
}

export const defaultSettings: ReaderSettings = {
  fontFamily: "Inter",
  fontSize: 16,
  lineHeight: 1.6,
};

// Server-side: Get settings from cookies
export async function getServerReaderSettings() {
  const cookieStore = await cookies();
  try {
    const settingsString = cookieStore.get("reader-settings")?.value;
    if (settingsString) {
      console.log("check", settingsString);
      const settings = JSON.parse(settingsString);
      return { ...defaultSettings, ...settings };
    }
  } catch (error) {
    console.error("Error parsing reader settings:", error);
  }

  return defaultSettings;
}
