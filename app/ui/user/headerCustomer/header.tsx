import { ScrollHeader } from "./scrollHeader";
import HeaderLinks from "./header-links";
import AuthActionsClient from "@/app/actions/headerActions";

export default function HeaderCustomer() {
  return (
    <ScrollHeader>
      <div className="flex flex-row grow gap-3 items-start justify-between py-[11px] px-14">
        <HeaderLinks />
        <AuthActionsClient />
      </div>
    </ScrollHeader>
  );
}
