import { CreditCard, User } from "lucide-react";

export default function PageInfo({ active }: { active: number }) {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 px-8 py-6 border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          {active === 1 ? (
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          ) : (
            ""
          )}
          {active === 2 ? (
            <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          ) : (
            ""
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {active === 1 ? `User profile` : ""}
            {active === 2 ? `Billing & Subscription` : ""}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
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
    </div>
  );
}
