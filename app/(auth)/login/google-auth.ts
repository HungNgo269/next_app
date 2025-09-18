// "use server";

// import { signIn } from "@/auth";
// import { redirect } from "next/navigation";

// export async function googleSignIn() {
//   const googleAuthUrl =
//     `https://accounts.google.com/o/oauth2/v2/auth?` +
//     `client_id=${process.env.GOOGLE_CLIENT_ID}` +
//     `&redirect_uri=${process.env.GOOGLE_REDIRECT_URL}` +
//     `&response_type=code` +
//     `&scope=openid email profile` +
//     `&include_granted_scopes=true`;
//   await signIn("google", redirect(googleAuthUrl));
// }
