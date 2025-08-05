import { useSession } from "next-auth/react";
import { useAuthStore } from "./useAuthStore";
import { useEffect } from "react";

//Đổ dữ liệu session vào store zustard(useAuthStore)
export function useHydrateAuth() {
  const { data: session, status } = useSession();
  const { setUser, setLoading } = useAuthStore();
  useEffect(() => {
    setLoading(status === "loading");
    if (status === "authenticated") {
      setUser(session?.user);
    }
    if (status === "unauthenticated") {
      setUser(null);
    }
  }, [status, session]);
}
