"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Loader2, Trash2 } from "lucide-react";
import { DeleteChapterAction } from "@/app/(admin)/dashboard/chapters/deleteChapterAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  chapterId: number;
  chapterTitle: string;
}

export default function DeleteChapter({ chapterId, chapterTitle }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    DeleteChapterAction,
    undefined
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(
        chapterTitle
          ? `${chapterTitle} deleted successfully`
          : "Chapter deleted successfully",
        {
          description: "The chapter has been permanently removed.",
        }
      );
      setIsDialogOpen(false);
      router.refresh();
    } else if (state?.success === false) {
      toast.error(state.message || "Delete failed");
    }
  }, [state, chapterTitle, router]);

  return (
    <>
      <button
        onClick={() => {
          setIsDialogOpen(!isDialogOpen);
        }}
      >
        <Trash2 className="w-5 h-5" />
      </button>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete Chapter
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chapter? This action cannot be
              undone.
              {chapterTitle && (
                <span className="block mt-2 font-medium text-foreground">
                  "{chapterTitle}"
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <form action={formAction}>
              <input type="hidden" name="id" value={chapterId} />
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
