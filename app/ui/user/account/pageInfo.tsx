import { CreditCard, User } from "lucide-react";

export default function PageInfo({ active }: { active: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-info/15 rounded-lg">
        {active === 1 ? <User className="h-5 w-5 text-info" /> : ""}
        {active === 2 ? <CreditCard className="h-5 w-5 text-info " /> : ""}
      </div>
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          {active === 1 ? `User profile` : ""}
          {active === 2 ? `Billing & Subscription` : ""}
        </h2>
        <p className="text-sm text-muted-foreground">
          {active === 1
            ? `Update your profile details. Changes are saved to your account.
`
            : ""}
          {active === 2
            ? `Manage your subscription and billing information`
            : ""}
        </p>
      </div>
    </div>
  );
}
