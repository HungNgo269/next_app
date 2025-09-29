"use client";
import { CreateChapterAction } from "@/app/(admin)/dashboard/books/[bookId]/chapters/add/addChapterAction";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Save, Upload } from "lucide-react";
import dynamic from "next/dynamic";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
const EditComponentNoSSR = dynamic(
  () => import("@/app/ui/admin/text-editor/chapterEditor"),
  {
    ssr: false,
  }
);
interface props {
  bookId: number;
}

export default function CreateChapterForm({ bookId }: props) {
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    chapterNumber: "",
  });
  const [state, formAction, isPending] = useActionState(
    CreateChapterAction,
    undefined
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (state?.success) {
      toast.success("Add book success!");
    } else if (state?.success === false && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  if (!mounted) {
    return <div>Loading editor...</div>;
  }
  return (
    <div className="min-h-screen bg-background w-full mx-auto ">
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-balance">
                  Add Chapter
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="submit"
                form="chapter-form"
                disabled={isPending}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {isPending ? "Adding..." : "Add chapter"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <form
          id="chapter-form"
          action={formAction}
          className="grid gap-8 lg:grid-cols-3"
        >
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Content Editor</CardTitle>
                <CardDescription>
                  Write and format your chapter content using the rich text
                  editor below.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <EditComponentNoSSR initialContent={""} onChange={setContent} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Chapter Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Chapter Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter chapter title..."
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="chapterNumber"
                    className="text-sm font-medium"
                  >
                    Chapter Number
                  </Label>
                  <Input
                    id="chapterNumber"
                    name="chapterNumber"
                    value={formData.chapterNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        chapterNumber: e.target.value,
                      })
                    }
                    placeholder="Enter chapter Numer..."
                    className="h-10"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Publishing Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Word Count</span>
                  <span className="text-foreground">
                    {
                      content
                        .replace(/<[^>]*>/g, "")
                        .split(" ")
                        .filter((word) => word.length > 0).length
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <input type="hidden" name="content" value={content} />
          <input type="hidden" name="bookid" value={bookId} />
        </form>

        {state?.errors && (
          <Card className="mt-6 border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-destructive">
                  Please fix the following errors:
                </h4>
                <ul className="space-y-1 text-sm text-destructive">
                  {Object.entries(state.errors).map(([field, messages]) =>
                    messages.map((msg, idx) => (
                      <li
                        key={`${field}-${idx}`}
                        className="flex items-center gap-2"
                      >
                        <div className="h-1 w-1 rounded-full bg-destructive" />
                        {msg}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
