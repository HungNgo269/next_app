"use client";

import {
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@/app/ui/button";
import { useActionState, useState } from "react";
import { authenticate } from "@/app/(auth)/login/actions";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PasswordField from "./passwordField";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <form
      action={formAction}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex relative overflow-hidden w-full"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Left side - Login form */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 relative z-10 my-auto">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="text-center space-y-2">
            <p className="text-white text-3xl">Please login to continue</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-300 mb-2"
                  htmlFor="email"
                >
                  Email address
                </label>
                <div className="relative">
                  <input
                    className="w-full h-12 px-4  bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all peer"
                    id="email"
                    type="email"
                    name="email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <PasswordField required minLength={6} />

              {/* Remember me and Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700 w-4 h-4"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Hidden field for redirect */}
            <input type="hidden" name="redirectTo" value={callbackUrl} />

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center space-x-2 p-3 bg-red-900/20 border border-red-800 rounded-lg">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{errorMessage}</p>
              </div>
            )}

            {/* Submit Button - Using form action */}
            <div>
              <Button
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                aria-disabled={isPending}
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Sign in
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-400">
                Need an account?{" "}
                <Link
                  href="/register"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto p-6 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <button className="text-gray-400 underline hover:text-gray-300 transition-colors">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-gray-400 underline hover:text-gray-300 transition-colors">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative bg-gradient-to-br from-blue-900/20 to-purple-900/20">
        <div className="text-center space-y-8 p-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white">
              Join thousands of users
            </h2>
            <p className="text-xl text-gray-300 max-w-md">
              Experience the power of modern authentication with enhanced
              security and seamless user experience.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 gap-6 max-w-sm mx-auto">
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Secure authentication</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Fast and reliable</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Privacy focused</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
