import LoginForm from "@/app/ui/user/auth/login-form";
import HeaderLogin from "@/app/ui/user/headerCustomer/headerLogin";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderLogin></HeaderLogin>
      <Suspense>
        <main className="flex  items-center justify-center my-auto">
          <div className="relative w-full">
            <LoginForm />
          </div>
        </main>
      </Suspense>
    </div>
  );
}
