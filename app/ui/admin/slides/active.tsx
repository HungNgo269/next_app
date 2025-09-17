import { CheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function Active({ status }: { status: boolean }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs",
        {
          "bg-gray-100 text-gray-500": status === false,
          "bg-green-500 text-white": status === true,
        }
      )}
    >
      {status === false ? <>Not Active</> : null}
      {status === true ? <>Active</> : null}
    </span>
  );
}
