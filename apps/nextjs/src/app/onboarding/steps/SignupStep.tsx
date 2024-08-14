import { SignUp } from "@clerk/nextjs";

export default function SignupStep() {
  return (
    <div className="mx-auto flex w-full items-center justify-center py-8">
      <SignUp
        routing="hash"
        appearance={{
          elements: {
            headerTitle: "Sign Up",
          },
        }}
      />
    </div>
  );
}
