"use client";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useActionState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUserAction } from "@/app/(auth)/register/actions";

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [state, formAction, isPending] = useActionState(
    registerUserAction,
    undefined
  );

  useEffect(() => {
    if (state?.success && state.redirectTo) {
      setTimeout(() => {
        router.push(state.redirectTo ?? "/");
      }, 1000);
    }
  }, [state, router]);

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md p-6">
        <header className="space-y-1 text-center">
          <h2 className="text-2xl font-bold">Register for NextBook</h2>
          <p className="text-muted-foreground">
            Create an account to get started
          </p>
        </header>

        <div className="mt-6">
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                fieldSize="lg"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                fieldSize="lg"
                placeholder="Enter your full name"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userName" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="userName"
                name="userName"
                type="text"
                fieldSize="lg"
                placeholder="Enter your username"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passWord" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="passWord"
                name="passWord"
                type="password"
                fieldSize="lg"
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                Date of Birth
              </Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                fieldSize="lg"
                required
              />
            </div>

            <input type="hidden" name="redirectTo" value={callbackUrl} />

            {state?.success && (
              <div className="flex items-center space-x-2 p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="h-5 w-5 text-success">✓</div>
                <p className="text-sm text-success">{state.message}</p>
              </div>
            )}

            {state && !state.success && (
              <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <ExclamationCircleIcon className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive">{state.message}</p>
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              disabled={isPending || state?.success}
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registering...
                </div>
              ) : state?.success ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Redirecting...
                </div>
              ) : (
                <div className="flex items-center justify-center hover:cursor-pointer">
                  Register with Email
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </div>
              )}
            </Button>
          </form>

          <hr className="border-0.5 border-border mt-6" />

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link
                prefetch={true}
                href="/login"
                className="text-primary hover:underline"
              >
                Log in now
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <Button
                variant="link"
                className="text-xs p-0 h-auto underline hover:cursor-pointer"
              >
                Terms of Service
              </Button>{" "}
              and{" "}
              <Button
                variant="link"
                className="text-xs p-0 h-auto underline hover:cursor-pointer"
              >
                Privacy Policy
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
