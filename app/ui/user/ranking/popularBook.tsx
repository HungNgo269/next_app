import { TimeFrame } from "@/app/data/rankingData";
import { fetchPopularBookAction } from "@/app/actions/bookActions";
import PopularBookClient from "@/app/ui/user/ranking/PopularBookClient";
interface MostPopularBookProps {
  initialTimeFilter?: TimeFrame;
}
export default async function MostPopularBook({
  initialTimeFilter = "Today",
}: MostPopularBookProps) {
  const initialBooks = await fetchPopularBookAction(initialTimeFilter);
  return (
    <PopularBookClient
      initialBooks={initialBooks}
      initialTimeFilter={initialTimeFilter}
    />
  );
}
