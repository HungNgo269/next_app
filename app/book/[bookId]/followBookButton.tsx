"use client";

import {
  AddBookFollowAction,
  GetBookFollowAction,
  RemoveBookFollowAction,
} from "@/app/actions/bookFollowActions";
import { Button } from "@/app/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
interface props {
  userId: string;
  bookId: number;
}
export default function FollowButton({ userId, bookId }: props) {
  const [followed, setFollowed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const check = async () => {
      const res = await GetBookFollowAction(userId, bookId);
      if (res) {
        setFollowed(true);
      }
    };
    check();
  }, [userId, bookId]);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (followed) {
        await RemoveBookFollowAction(userId, bookId);
        setFollowed(false);
      } else {
        await AddBookFollowAction(userId, bookId);
        setFollowed(true);
      }
    } catch (error) {
      toast.error("something is wrong, try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="h-full"
      disabled={isLoading}
      onClick={() => {
        handleClick();
      }}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {followed ? "Unfollow this book" : "Follow this book"}{" "}
    </Button>
  );
}
