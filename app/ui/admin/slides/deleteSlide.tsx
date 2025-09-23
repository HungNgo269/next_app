"use client";

import type React from "react";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DeleteSlideAction } from "@/app/(admin)/dashboard/slides/deleteSlideAction";
import { toast } from "sonner";

interface Props {
  slideId: number;
  slideTitle: string;
}

export default function DeleteSlide({ slideId, slideTitle }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    DeleteSlideAction,
    undefined
  );
  useEffect(() => {
    if (state?.success) {
      toast.success(
        slideTitle
          ? `${slideTitle} deleted successfully`
          : "Item deleted successfully",
        {
          description: "The item has been permanently removed.",
        }
      );
      setIsDialogOpen(false);
      router.refresh();
    } else if (state?.success === false) {
      toast.error(state.message || "Delete failed");
    }
  }, [state]);
  return (
    <>
      <button
        onClick={() => {
          setIsDialogOpen(!isDialogOpen);
        }}
      >
        <Trash2 className="w-5 h-5"></Trash2>
      </button>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete Item
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be
              undone.
              {slideTitle && (
                <span className="block mt-2 font-medium text-foreground">
                  "{slideTitle}"
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <form action={formAction}>
              <input type="hidden" name="id" value={slideId} />
              <AlertDialogAction asChild>
                <Button
                  variant="destructive"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </>
                  )}
                </Button>
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
