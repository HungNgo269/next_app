"use client";

import type React from "react";

import { useEffect, useState, useTransition } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Save, Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UploadBookAction } from "@/app/(admin)/dashboard/books/bookUploadActions";

interface UploadBookProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function UploadBook({
  open,
  onOpenChange,
}: UploadBookProps = {}) {
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
    name: "",
    author: "",
    description: "",
    is_active: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();
  const [state, formAction, isPending] = useActionState(
    UploadBookAction,
    undefined
  );
  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        if (!file.type.startsWith("image/")) {
          throw new Error("Please select an image file");
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("Image size should be less than 5MB");
        }

        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Image upload error:", error);
        e.target.value = "";
        toast.error(
          error instanceof Error ? error.message : "Upload failed. Try again"
        );
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formDataSubmit = new FormData(form);
    formDataSubmit.set("is_active", String(formData.is_active));
    if (selectedFile) {
      formDataSubmit.set("image", selectedFile);
    }
    startTransition(async () => {
      await formAction(formDataSubmit);
    });
  };

  useEffect(() => {
    if (state?.success) {
      toast.success("Upload book success!");
      setFormData({ name: "", author: "", description: "", is_active: true });
      setSelectedFile(null);
      setImagePreview(null);
      setDialogOpen(false);
      router.refresh();
    } else if (state?.success === false && state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Upload Book</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 py-2"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={Boolean(formData.is_active)}
              onCheckedChange={(checked: boolean) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
            <input
              id="is_active"
              type="hidden"
              name="is_active"
              value={String(formData.is_active || false)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagePreview">Image Preview</Label>

            {imagePreview && (
              <div
                id="imagePreview"
                className="mx-auto relative h-32 w-44 overflow-hidden rounded border"
              >
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              name="image"
              accept="image/*"
              type="file"
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Max size: 5MB. Formats: JPG, PNG, GIF
            </p>
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
