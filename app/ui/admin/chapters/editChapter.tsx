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
import { Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Chapter } from "@/app/interface/chapter";
import { EditChapterAction } from "@/app/(admin)/dashboard/chapters/editChapterAction";

interface Props {
  chapter?: Partial<Chapter> & { id?: number };
}

export default function EditChapter({ chapter }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    book_id: chapter?.book_id ? String(chapter.book_id) : "",
    chapter_number: chapter?.chapter_number ? String(chapter.chapter_number) : "",
    title: chapter?.title ?? "",
    content: chapter?.content ?? "",
  });
  const [isLoading, startTransition] = useTransition();
  const [state, formAction, isPending] = useActionState(
    EditChapterAction,
    undefined
  );
  const router = useRouter();

  useEffect(() => {
    if (isDialogOpen && chapter) {
      setFormData({
        book_id: chapter.book_id ? String(chapter.book_id) : "",
        chapter_number: chapter.chapter_number
          ? String(chapter.chapter_number)
          : "",
        title: chapter.title ?? "",
        content: chapter.content ?? "",
      });
    }
  }, [isDialogOpen, chapter]);

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
      toast.success("Chapter updated successfully");
      setIsDialogOpen(false);
      router.refresh();
    } else if (state?.success === false && state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <>
      <button
        onClick={() => {
          setIsDialogOpen(!isDialogOpen);
        }}
      >
        <Edit className="w-5 h-5" />
      </button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Chapter</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <input type="hidden" name="id" value={chapter?.id ?? ""} />
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

            <div className="flex gap-2 pt-2">
              <Button type="submit" size="sm" disabled={isPending || isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isPending || isLoading ? "Saving..." : "Save"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
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
    </>
  );
}
