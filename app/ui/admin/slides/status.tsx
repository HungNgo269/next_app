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
          "bg-success/15 text-success": status === Status.completed,
          "bg-primary/10 text-primary/80": status === Status.on_going,
          "bg-warning/15 text-warning": status === Status.hiatus,
          "bg-destructive/10 text-destructive": status === Status.cancelled,
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
