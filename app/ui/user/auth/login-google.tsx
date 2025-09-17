import { googleSignIn } from "@/app/(auth)/login/googleLoginAction";
import { GoogleButton } from "@/app/ui/share/Button/GoogleButton";

export default function GoogleSignIn() {
  return (
    <form action={googleSignIn} className="w-full mt-4">
      <GoogleButton />
    </form>
  );
}
