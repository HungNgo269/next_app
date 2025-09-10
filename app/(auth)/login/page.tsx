import LoginForm from "@/app/ui/user/auth/login-form";
import { Suspense } from "react";
import { LoginCanvas } from "@/app/(auth)/login/loginCanvas";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* <LoginCanvas width="half" /> */}

      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
