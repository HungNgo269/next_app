"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UploadChapterAction } from "@/app/(admin)/dashboard/chapters/uploadChapterAction";
import Link from "next/link";

interface UploadChapterProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function UploadChapter({
  open,
  onOpenChange,
}: UploadChapterProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof open === "boolean";
  const dialogOpen = isControlled ? (open as boolean) : internalOpen;

  const setDialogOpen = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);
  };

  const [formData, setFormData] = useState({
    book_id: "",
    chapter_number: "",
    title: "",
    content: "",
  });
  const [isLoading, startTransition] = useTransition();
  const [state, formAction, isPending] = useActionState(
    UploadChapterAction,
    undefined
  );
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formDataSubmit = new FormData(form);
    startTransition(async () => {
      await formAction(formDataSubmit);
    });
  };

  useEffect(() => {
    if (state?.success) {
      toast.success("Chapter created successfully");
      setFormData({ book_id: "", chapter_number: "", title: "", content: "" });
      setDialogOpen(false);
      router.refresh();
    } else if (state?.success === false && state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Chapter</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="book_id">Book ID</Label>
              <Input
                id="book_id"
                name="book_id"
                type="number"
                min={1}
                value={formData.book_id}
                onChange={(e) =>
                  setFormData({ ...formData, book_id: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chapter_number">Chapter Number</Label>
              <Input
                id="chapter_number"
                name="chapter_number"
                type="number"
                min={0}
                value={formData.chapter_number}
                onChange={(e) =>
                  setFormData({ ...formData, chapter_number: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={6}
              required
            />
          </div>

          {state?.errors && (
            <ul className="text-sm text-destructive">
              {Object.entries(state.errors).map(([field, messages]) =>
                messages.map((msg, idx) => (
                  <li key={`${field}-${idx}`}>{msg}</li>
                ))
              )}
            </ul>
          )}

          <div className="flex gap-2 pt-2 justify-end items-end">
            <Link href={`/dashboard/books/1/chapters/add`}>
              <Button size="sm" disabled={isPending || isLoading}>
                Want to use Rich Text Editor ?
              </Button>
            </Link>
            <Button type="submit" size="sm" disabled={isPending || isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isPending || isLoading ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              size="sm"
              disabled={isPending || isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
