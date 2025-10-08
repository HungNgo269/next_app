import { syncViewsToDatabase } from "@/lib/service/syncViewToDB";

export async function GET() {
  try {
    const result = await syncViewsToDatabase();
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
