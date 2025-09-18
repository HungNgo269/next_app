"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateAccountInfo } from "./actions";
import type { UserProfile } from "@/app/interface/user";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { PhoneInput } from "./phoneInput";

interface AccountInfoProps {
  user: UserProfile | null;
}

type FormState = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

const mapProfileToFormState = (profile: UserProfile | null): FormState => ({
  name: profile?.name ?? "",
  email: profile?.email ?? "",
  phone: profile?.phone ?? "",
  address: profile?.address ?? "",
});

const editableKeys: Array<keyof FormState> = ["name", "phone", "address"];

export default function AccountInfo({ user }: AccountInfoProps) {
  const [formState, setFormState] = useState<FormState>(() =>
    mapProfileToFormState(user)
  );
  const [baselineState, setBaselineState] = useState<FormState>(() =>
    mapProfileToFormState(user)
  );
  const [showActions, setShowActions] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const nextState = mapProfileToFormState(user);
    setFormState(nextState);
    setBaselineState(nextState);
    setShowActions(false);
  }, [user]);

  const hasChanges = useMemo(() => {
    return editableKeys.some((key) => formState[key] !== baselineState[key]);
  }, [formState, baselineState]);

  const handleFieldChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setShowActions(true);
    setFeedback(null);
  };

  const handleCancel = () => {
    setFormState({ ...baselineState });
    setShowActions(false);
    setFeedback(null);
  };

  const handleSave = () => {
    if (!hasChanges || isPending) {
      return;
    }

    setFeedback(null);

    startTransition(() => {
      updateAccountInfo({
        name: formState.name,
        phone: formState.phone,
        address: formState.address,
      })
        .then((result) => {
          if (result.success) {
            const updatedState = mapProfileToFormState(result.data);
            setBaselineState(updatedState);
            setFormState(updatedState);
            setShowActions(false);
            setFeedback({
              type: "success",
              message: result.message ?? "Profile updated successfully.",
            });
          } else {
            setFeedback({ type: "error", message: result.error });
          }
        })
        .catch(() => {
          setFeedback({
            type: "error",
            message: "Unable to update profile. Please try again.",
          });
        });
    });
  };

  if (!user) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
        Sign in to view and manage your profile information.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={formState.name}
            onChange={(event) => handleFieldChange("name", event.target.value)}
            onFocus={() => setShowActions(true)}
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            value={formState.email}
            readOnly
            disabled
            className="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Email updates are handled separately for security reasons.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <PhoneInput
            id="phone"
            value={formState.phone}
            onChange={(value) => handleFieldChange("phone", value)}
            onFocus={() => setShowActions(true)}
            placeholder="Add a phone number"
            international={true} // Hiển thị format local (không có +84)
          ></PhoneInput>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formState.address}
            onChange={(event) =>
              handleFieldChange("address", event.target.value)
            }
            onFocus={() => setShowActions(true)}
            placeholder="Add an address"
          />
        </div>
      </div>

      {showActions && (
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isPending}
            className="gap-2"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Save changes
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      )}

      {feedback && (
        <div
          className={`flex items-start gap-3 rounded-lg border p-4 text-sm ${
            feedback.type === "success"
              ? "border-success/25 bg-success/10 text-success dark:border-success/40 dark:bg-success/20 dark:text-success/80"
              : "border-destructive/20 bg-destructive/10 text-destructive dark:border-destructive/35 dark:bg-destructive/20 dark:text-destructive/80"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}
    </div>
  );
}
