import { SignIn } from "@clerk/nextjs";
import React from "react";

type Props = {};

export default function SignInPage(props: Props) {
  return <SignIn signUpUrl="/sign-up" />;
}
