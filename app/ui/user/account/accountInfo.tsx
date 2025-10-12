"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserProfile } from "@/app/interface/user";
import { PhoneInput } from "./phoneInput";
import { useActionState } from "react";
import { updateAccountInfo } from "@/app/ui/user/account/actions";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface AccountInfoProps {
  user: UserProfile | null;
}

export default function AccountInfo({ user }: AccountInfoProps) {
  const [state, formAction, isPending] = useActionState(updateAccountInfo, {
    success: undefined,
    error: "",
    message: "",
  });

  const initialValues = {
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  };

  const [formValues, setFormValues] = useState(initialValues);

  const hasChanged =
    formValues.name !== initialValues.name ||
    formValues.phone !== initialValues.phone ||
    formValues.address !== initialValues.address;

  useEffect(() => {
    if (state.success === true) {
      setFormValues({
        name: formValues.name,
        phone: formValues.phone,
        address: formValues.address,
      });
      toast.success("Change profile success");
    }
    if (state.success === false) {
      setFormValues({
        name: formValues.name,
        phone: formValues.phone,
        address: formValues.address,
      });
      toast.error("Change profile fail");
    }
  }, [state.success]);
  console.log("state", state);
  return (
    <div className="space-y-8">
      <form action={formAction} className="grid gap-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter your full name"
            defaultValue={user?.name! ?? ""}
            onChange={(e) =>
              setFormValues({ ...formValues, name: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            readOnly
            disabled
            defaultValue={user?.email!}
          />
          <p className="text-xs text-muted-foreground">
            Email updates are handled separately for security reasons.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <PhoneInput
            id="phone"
            name="phone"
            placeholder="Add a phone number"
            international={true}
            defaultValue={user?.phone! ?? ""}
            onChange={(value) =>
              setFormValues({ ...formValues, phone: value || "" })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            placeholder="Add an address"
            defaultValue={user?.address ?? ""}
            onChange={(e) =>
              setFormValues({ ...formValues, address: e.target.value })
            }
          />
        </div>

        {hasChanged && (
          <div className="space-y-2">
            <Button disabled={isPending} id="submit">
              Save your change
            </Button>
          </div>
        )}
        {state.error && (
          <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <ExclamationCircleIcon className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{state.error}</p>
          </div>
        )}
      </form>
    </div>
  );
}
