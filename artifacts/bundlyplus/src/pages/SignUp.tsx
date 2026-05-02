import React from "react";
import { SignUp } from "@clerk/react";
import { basePath } from "@/lib/clerk-appearance";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 pt-28 pb-16">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
        fallbackRedirectUrl={`${basePath}/account`}
      />
    </div>
  );
}
