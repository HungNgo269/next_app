"use client";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useActionState, useEffect, useRef } from "react";
import { authenticate } from "@/app/(auth)/login/actions";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GoogleSignIn from "./login-google";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const focus = () => {
      ref?.current?.focus();
    };
    focus();
  }, []);
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md    p-6">
        <header className="space-y-1 text-center">
          <h2 className="text-2xl font-bold">Login To NextBook</h2>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </header>

        <div className="mt-6">
          <form action={formAction} className="space-y-4">
            <div className="space-y-2 ">
              <Input
                id="email"
                name="email"
                type="email"
                fieldSize={"lg"}
                placeholder="Email Address"
                required
                ref={ref}
              />
            </div>

            <div className="space-y-2">
              <Input
                id="password"
                name="password"
                type="password"
                fieldSize={"lg"}
                placeholder="Password"
                required
                minLength={6}
              />
            </div>
            <div className="flex items-center justify-center">
              <Button
                variant="link"
                className="text-sm p-0 h-auto hover:cursor-pointer"
              >
                Forgot password?
              </Button>
            </div>

            <input type="hidden" name="redirectTo" value={callbackUrl} />
            {/* gửi kèm link redirect */}

            {errorMessage && (
              <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <ExclamationCircleIcon className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive">{errorMessage}</p>
              </div>
            )}

            <Button className="w-full" size="lg" disabled={isPending}>
              {isPending ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Login in...
                </div>
              ) : (
                <div className="flex items-center justify-center hover:cursor-pointer">
                  Login with Email
                </div>
              )}
            </Button>
          </form>
          <GoogleSignIn></GoogleSignIn>

          <div className="pt-4"></div>
          <hr className="border-0.5 border-border " />
          <div className="text-center mt-4">
            <p className="text-muted-foreground text-sm">
              Need an account?{" "}
              <Link
                prefetch={true}
                href="/register"
                className="text-primary hover:underline"
              >
                Create one now
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
