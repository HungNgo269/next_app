import ManageSubscription from "../subscription/manageSubcription";
import AccountInfo from "./accountInfo";
import PageInfo from "./pageInfo";
import type { UserProfile } from "@/app/interface/user";

export default function PageContent({
  active,
  user,
}: {
  active: number;
  user: UserProfile;
}) {
  return (
    <div className="flex-6">
      <PageInfo active={active} />
      <div className="p-8">
        {active === 1 && (
          <>
            <AccountInfo user={user}></AccountInfo>
          </>
        )}
        {active === 2 && (
          <>
            <ManageSubscription></ManageSubscription>
          </>
        )}
      </div>
    </div>
  );
}
