import LoginForm from "@/app/ui/auth/login-form";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
