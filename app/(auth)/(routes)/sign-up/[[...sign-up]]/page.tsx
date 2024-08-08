import { SignUp } from "@clerk/nextjs";
import React from "react";

type Props = {};

export default function SignUpPage(props: Props) {
  return <SignUp afterSignOutUrl={"/"} />;
}
