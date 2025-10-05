import LoginForm from "@/app/ui/user/auth/login-form";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
