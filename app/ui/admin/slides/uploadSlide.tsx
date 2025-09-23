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
import type { ISlide } from "@/app/interface/slide";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UploadSlideAction } from "@/app/(admin)/dashboard/slides/uploadSlideAction";

interface UploadSlideProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function UploadSlide({
  open,
  onOpenChange,
}: UploadSlideProps = {}) {
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
    title: "",
    redirect_url: "",
    display_order: 0,
    is_active: true,
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();
  const [state, formAction, isPending] = useActionState(
    UploadSlideAction,
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
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Image upload error:", error);
        e.target.value = "";
      }
    }
  };
  //custom formsumission cho file anhr
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formDataSubmit = new FormData(form);
    if (selectedFile) {
      formDataSubmit.set("image", selectedFile);
    }
    startTransition(async () => {
      await formAction(formDataSubmit);
    });
  };

  useEffect(() => {
    if (state?.success) {
      toast("Upload slide success!");
      setDialogOpen(false);
      router.refresh();
    }
  }, [state?.success]);
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[700px] ">
        <DialogHeader>
          <DialogTitle>Upload Slide</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 py-2"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="redirect_url">Redirect URL</Label>
              <Input
                id="redirect_url"
                name="redirect_url"
                value={formData.redirect_url}
                onChange={(e) =>
                  setFormData({ ...formData, redirect_url: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                name="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display_order: Number(e.target.value),
                  })
                }
                min={0}
              />
            </div>

            <div className="flex items-center space-x-2 h-full">
              <Switch
                checked={Boolean(formData?.is_active)}
                onCheckedChange={(checked: boolean) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <input
                id="is_active"
                type="hidden"
                name="is_active"
                value={String(formData?.is_active || false)}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e: any) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="space-y-2 ">
            <Label htmlFor="imagePreview">Image Preview</Label>

            {imagePreview && (
              <div
                id="imagePreview"
                className="mx-auto relative h-30 w-52   object-cover rounded border"
              >
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  fill
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
