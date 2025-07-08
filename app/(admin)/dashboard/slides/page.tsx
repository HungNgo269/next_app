import SlideTable from "@/app/ui/slides/slideTable";
import UserActions from "./userActions";
export default function SlidesPage() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <UserActions></UserActions>
      <SlideTable></SlideTable>
    </div>
  );
}
