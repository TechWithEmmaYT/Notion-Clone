"use client";
import React from "react";
import { useTheme } from "next-themes";
import Section from "../section-label";
import { cn } from "@/lib/utils";
import { SystemMode } from "../themes-placeholder/systemmode";
import { LightMode } from "../themes-placeholder/lightmode";
import { DarkMode } from "../themes-placeholder/darkmode";

const Settings = () => {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex flex-col items-start justify-start gap-5">
      <div className="">
        <Section
          label="Interface Theme"
          message="Select or customize your UI theme "
        />
      </div>
      <div className="flex flex-row h-auto items-start gap-1">
        <div
          className={cn(
            "rounded-2xl w-auto h-auto overflow-hidden cursor-pointer border-4 border-transparent",
            theme == "system" && "border-primary"
          )}
          onClick={() => setTheme("system")}
        >
          <SystemMode />
        </div>
        <div
          className={cn(
            "rounded-2xl w-auto h-auto overflow-hidden cursor-pointer border-4 border-transparent",
            theme == "light" && "border-primary"
          )}
          onClick={() => setTheme("light")}
        >
          <LightMode />
        </div>
        <div
          className={cn(
            "rounded-2xl w-auto h-auto overflow-hidden cursor-pointer border-4 border-transparent",
            theme == "dark" && "border-primary"
          )}
          onClick={() => setTheme("dark")}
        >
          <DarkMode />
        </div>
      </div>
    </div>
  );
};

export default Settings;
