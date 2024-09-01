"use client";
import { SignIn, useAuth } from "@clerk/clerk-react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { Spinner } from "@/components/spinner";

const Signin = () => {
  const { isLoaded } = useAuth();

  return (
    <div className="w-full h-full">
      <div className="w-full flex flex-col items-center justify-center bg-[rgb(255, 254, 252)] flex">
        <nav
          className=" relative w-full max-w-[1300px] flex items-center justify-start px-[20px]
        h-20 overflow-hidden
        "
        >
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0 mr-[3px]">
              <Logo />
            </span>
            <div className="w-[0.5px] h-[18px] bg-gray-300" />
            <Button
              variant="ghost"
              className="py-[4px] px-[3px] !m-0 gap-1 text-gray-400 !font-normal !h-auto"
            >
              <Globe size="15px" />
              <span>English</span>
            </Button>
          </div>
          <div className="flex-1"></div>
        </nav>
      </div>
      <main className="w-full flex items-center justify-center pt-5">
        <div className="flex items-center justify-center w-full max-w-[1260px] mx-auto">
          {!isLoaded ? <Spinner size="icon" /> : <SignIn />}
        </div>
      </main>
    </div>
  );
};

export default Signin;
