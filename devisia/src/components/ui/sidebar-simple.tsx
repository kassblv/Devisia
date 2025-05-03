"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { theme } from "@/styles/theme/theme";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-screen px-2 py-4 hidden md:flex md:flex-col w-[300px] shrink-0 border-r",
          "transition-colors duration-300",
          "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700",
          className
        )}
        style={{
          backgroundColor: theme.colors.background.secondary,
          borderColor: theme.colors.primary[100],
        }}
        animate={{
          width: animate ? (open ? "300px" : "80px") : "300px",
        }}
        transition={{ duration: 0.3, ease: theme.transitions.easing }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-16 px-4 py-2 flex flex-row md:hidden items-center justify-between w-full border-b",
          "transition-colors duration-300"
        )}
        style={{
          backgroundColor: theme.colors.background.secondary,
          borderColor: theme.colors.primary[100],
          color: theme.colors.text.primary,
        }}
        {...props}
      >
        <div className="flex justify-between z-20 w-full items-center">
          <div 
            className="font-bold text-lg" 
            style={{ color: theme.colors.primary[600] }}
          >
            Devisia
          </div>
          <IconMenu2
            style={{ color: theme.colors.text.primary }}
            className="h-6 w-6 cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: theme.transitions.easing,
              }}
              className={cn(
                "fixed h-screen w-full inset-0 p-6 z-[100] flex flex-col justify-between overflow-y-auto",
                className
              )}
              style={{
                backgroundColor: theme.colors.background.primary,
                color: theme.colors.text.primary,
              }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div 
                    className="font-bold text-xl" 
                    style={{ color: theme.colors.primary[600] }}
                  >
                    Devisia
                  </div>
                  <div
                    className="p-2 rounded-full cursor-pointer hover:bg-gray-100"
                    style={{ 
                      color: theme.colors.text.primary,
                    }}
                    onClick={() => setOpen(false)}
                  >
                    <IconX className="h-5 w-5" />
                  </div>
                </div>
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  onClick,
  ...props
}: {
  link: Links;
  className?: string;
  onClick?: () => void;
}) => {
  const { open, animate } = useSidebar();
  const handleClick = (e: React.MouseEvent) => {
    // Si un onClick est fourni dans le lien ou en prop, l'utiliser
    if (link.onClick) {
      e.preventDefault();
      link.onClick();
    } else if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      href={link.href}

      style={{}}
      className={cn(
        "flex items-center h-10 px-2 rounded-md",
        open ? "justify-start gap-3" : "justify-center",
        "transition-all duration-300 hover:bg-gray-100",
        link.className,
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {/* L'icône reste toujours visible et centrée quand la sidebar est fermée */}
      <div className={cn("flex items-center justify-center", open ? "w-auto" : "w-full")}>
        {link.icon}
      </div>
      
      {/* Afficher le texte uniquement quand la sidebar est ouverte */}
      {open && (
        <span 
          className="text-sm truncate"
          style={{ 
            color: link.className?.includes("text-primary") ? theme.colors.primary[600] : "inherit" 
          }}
        >
          {link.label}
        </span>
      )}
    </a>
  );
};
