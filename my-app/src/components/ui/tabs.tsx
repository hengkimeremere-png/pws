"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const TabsContext = React.createContext<{ value: string; onValueChange: (value: string) => void } | null>(null);

const Tabs = ({ children, defaultValue, value, onValueChange, className, ...props }: {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [activeValue, setActiveValue] = React.useState(defaultValue || "");
  const currentValue = value !== undefined ? value : activeValue;
  
  const handleValueChange = (newValue: string) => {
    setActiveValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={cn("space-y-4", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, className, ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-zinc-100 p-1 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const TabsTrigger = ({ children, value, className, ...props }: { children: React.ReactNode; value: string; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const context = React.useContext(TabsContext);
  const activeValue = context?.value;
  const onValueChange = context?.onValueChange;
  
  const isActive = activeValue === value;
  
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
          : "hover:text-zinc-900 dark:hover:text-zinc-100",
        className
      )}
      onClick={() => onValueChange?.(value)}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value, className, ...props }: { children: React.ReactNode; value: string; className?: string } & React.HTMLAttributes<HTMLDivElement>) => {
  const context = React.useContext(TabsContext);
  const activeValue = context?.value;
  
  if (activeValue !== value) return null;
  
  return (
    <div className={cn("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2", className)} {...props}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
