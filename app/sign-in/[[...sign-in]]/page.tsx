import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="container">
      <div className="wrapper py-10 flex justify-center">
        <SignIn afterSignInUrl="/" signUpUrl="/sign-up" />
      </div>
    </main>
  );
}
