"use client";

import type React from "react";

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
import { DeleteBookAction } from "@/app/(admin)/dashboard/books/deleteBookAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  bookId: number;
  bookTitle: string;
}

export default function DeleteBook({ bookId, bookTitle }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    DeleteBookAction,
    undefined
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(
        bookTitle
          ? `${bookTitle} deleted successfully`
          : "Book deleted successfully",
        {
          description: "The book has been permanently removed.",
        }
      );
      setIsDialogOpen(false);
      router.refresh();
    } else if (state?.success === false) {
      toast.error(state.message || "Delete failed");
    }
  }, [state, bookTitle, router]);

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
              Delete Book
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this book? This action cannot be
              undone.
              {bookTitle && (
                <span className="block mt-2 font-medium text-foreground">
                  "{bookTitle}"
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <form action={formAction}>
              <input type="hidden" name="id" value={bookId} />
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
