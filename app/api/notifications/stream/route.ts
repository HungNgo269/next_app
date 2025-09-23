// import { auth } from "@/auth";
// import { NextRequest } from "next/server";

// export async function GET(req:NextRequest){
//   const session = await auth();
//   const user = session?.user;
//   const stream  = new ReadableStream({
//     start(controller) {
//         const encoder= new TextEncoder()
//         //encode -> transport -> decode
//         controller.enqueue(
//             encoder.encode("data :{'type':'connected','message':'SSE connected'}\n\n")
//         )
//         const CheckNewChapter

//     },
//   })
// }
