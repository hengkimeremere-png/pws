"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | null>(null);

const Dialog = ({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const onOpenChange = controlledOnOpenChange || setUncontrolledOpen;

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({ children }: { children: React.ReactElement<any> }) => {
  const context = React.useContext(DialogContext);
  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e);
      context?.onOpenChange(true);
    },
  });
};

const DialogContent = ({
  children,
  className,
  open: propOpen,
  onOpenChange: propOnOpenChange,
  ...props
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const context = React.useContext(DialogContext);
  const isOpen = propOpen !== undefined ? propOpen : (context?.open ?? false);
  const handleClose = propOnOpenChange || context?.onOpenChange;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => handleClose?.(false)}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative z-50 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)} {...props}>
    {children}
  </div>
);

const DialogTitle = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props}>
    {children}
  </h2>
);

const DialogDescription = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-zinc-500 dark:text-zinc-400 mt-1", className)} {...props}>
    {children}
  </p>
);

const DialogFooter = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2", className)} {...props}>
    {children}
  </div>
);

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };
