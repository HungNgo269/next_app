import RegisterForm from "@/app/ui/user/auth/register-form";
import HeaderSignIn from "@/app/ui/user/headerCustomer/headerSignIn";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderSignIn></HeaderSignIn>
      <Suspense>
        <main className="flex  items-center justify-center my-auto">
          <div className="relative w-full">
            <RegisterForm />
          </div>
        </main>
      </Suspense>
    </div>
  );
}
