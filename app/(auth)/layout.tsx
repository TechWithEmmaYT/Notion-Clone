"use client";

import React, { ReactNode } from "react";
import { useConvexAuth } from "convex/react";
import { Spinner } from "@/components/spinner";
import { redirect } from "next/navigation";

function AuthLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center w-full justify-center">
        <Spinner size="icon" />
      </div>
    );
  }

  if (isAuthenticated) {
    return redirect("/documents");
  }

  return <div>{children}</div>;
}

export default AuthLayout;
