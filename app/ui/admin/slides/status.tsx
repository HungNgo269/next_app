import clsx from "clsx";

export enum Status {
  completed = "completed",
  on_going = "on_going",
  hiatus = "hiatus",
  cancelled = "cancelled",
}

export default function StatusLabel({ status }: { status: Status }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        {
          "bg-green-100 text-green-800": status === Status.completed,
          "bg-blue-100 text-blue-800": status === Status.on_going,
          "bg-yellow-100 text-yellow-800": status === Status.hiatus,
          "bg-red-100 text-red-800": status === Status.cancelled,
        }
      )}
    >
      {status === Status.completed && "Completed"}
      {status === Status.on_going && "On Going"}
      {status === Status.hiatus && "Hiatus"}
      {status === Status.cancelled && "Cancelled"}
    </span>
  );
}
