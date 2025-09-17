import ManageSubscription from "../subscription/manageSubcription";
import AccountInfo from "./accountInfo";
import PageInfo from "./pageInfo";
import { subcriptionsInfo } from "@/app/interface/subcription";
import type { UserProfile } from "@/app/interface/user";

export default function PageContent({
  subscription,
  active,
  user,
}: {
  subscription: subcriptionsInfo | null;
  active: number;
  user: UserProfile | null;
}) {
  const renderContent = () => {
    switch (active) {
      case 1:
        return <AccountInfo user={user} />;
      case 2:
        return <ManageSubscription subscription={subscription} />;

      default:
        return <AccountInfo user={user} />;
    }
  };

  return (
    <div className="flex-6">
      <PageInfo active={active} />
      <div className="p-8">{renderContent()}</div>
    </div>
  );
}
