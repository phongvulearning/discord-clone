import React from "react";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen flex-col  justify-center items-center">
      {children}
    </div>
  );
};

export default AuthLayout;
