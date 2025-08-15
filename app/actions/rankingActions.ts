"use server";

import {
  FetchMostFollowBookAllTime,
  FetchMostFollowBookByMonth,
  FetchMostFollowBookByWeek,
} from "@/app/data/rankingData";

export async function fetchMostFollowBookAllTimeAction() {
  try {
    return await FetchMostFollowBookAllTime();
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}

export async function fetchMostFollowBookByMonthAction() {
  try {
    return await FetchMostFollowBookByMonth();
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}

export async function fetchMostFollowBookByWeekAction() {
  try {
    return await FetchMostFollowBookByWeek();
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch category books");
  }
}
