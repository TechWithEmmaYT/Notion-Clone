import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ToolTip = (props: {
  children: React.ReactNode;
  content: JSX.Element;
  style?: any;
}) => {
  const { content, children, style } = props;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="w-full">{children}</TooltipTrigger>
        <TooltipContent align="end" style={style}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ToolTip;
