import RegisterForm from "@/app/ui/auth/register-form";
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
