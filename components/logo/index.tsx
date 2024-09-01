import React from "react";
import Image from "next/image";
import logo from "@/public/images/logo.png";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Image src={logo} width={35} height={35} alt="Notion clone" />
      <h2 className="font-bold text-xl sr-only">Notion clone</h2>
    </div>
  );
};

export default Logo;
