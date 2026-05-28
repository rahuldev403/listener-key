import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="container">
      <div className="wrapper py-10 flex justify-center">
        <SignUp afterSignUpUrl="/" signInUrl="/sign-in" />
      </div>
    </main>
  );
}
