import RegisterForm from "@/app/ui/user/auth/register-form";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <div>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
