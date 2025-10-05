import {
  fetchMostViewedBookActions,
  fetchNewBookAction,
} from "@/app/actions/bookActions";
import Swipper from "@/app/ui/user/swipper/swipper";

export default async function SwipperBestSeller() {
  const Books = await fetchMostViewedBookActions();
  return <Swipper books={Books}></Swipper>;
}
