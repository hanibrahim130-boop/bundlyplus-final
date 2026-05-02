import React from "react";
import { SignIn } from "@clerk/react";
import { basePath } from "@/lib/clerk-appearance";

export default function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 pt-28 pb-16">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        fallbackRedirectUrl={`${basePath}/account`}
      />
    </div>
  );
}
