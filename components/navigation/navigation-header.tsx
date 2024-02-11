"use client";

import ActionTooltip from "@/components/action-tooltip";
import { cn } from "@/lib/utils";
import NeptuneLogoLight from "@/public/logo/logo-light.svg"
import NeptuneLogoDark from "@/public/logo/logo-dark.svg";
import { AnimatePresence, Spring, motion, useCycle } from "framer-motion";
import { ChevronDown, Compass, Plus } from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { useModal } from "@/app/hooks/useModalStore";

const NavigationHeader = ({ pathname }: { pathname: string | null }) => {
  const { theme } = useTheme()
  const { onOpen } = useModal()
  const [open, cycleOpen] = useCycle(false, true)

  const [isMounted, setIsMounted] = useState(false)

  const onEnter = { opacity: 0, scale: 0 };
  const animate = { opacity: 1, scale: 1 };
  const onLeave = { opacity: 0, scale: 0 };

  const transitionSpringPhysics: Spring = {
    type: "spring",
    mass: 0.2,
    stiffness: 80,
    damping: 5,
    duration: 5,
  }

  useEffect(() => {
    setIsMounted(true)
  }, [theme])

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence initial={false} mode="popLayout">
        <div className="mb-3">
          <ActionTooltip side="right" align="center" label="Direct Messages">
            <Link href="/me/channels" className="flex items-center group">
              <div className={cn(
                "absolute left-0 bg-primary rounded-r-full transition-all w-1",
                !pathname?.includes("me") && "group-hover:h-5 group-hover:scale-100",
                pathname?.includes("me") ? "h-9" : "h-0 scale-0"
              )} />
              <div className={cn(
                "flex items-center justify-center w-12 h-12 mx-3 overflow-hidden transition-all rounded-3xl group-hover:rounded-2xl bg-background dark:bg-neutral-700 group-hover:bg-sky-500",
                pathname?.includes("me") && "bg-sky-500 dark:bg-sky-500 text-primary rounded-2xl"
              )}>
                {isMounted && (
                  <>
                    {theme === "dark" && <NeptuneLogoDark height={25} />}
                    {theme === "light" && <NeptuneLogoLight height={25} />}
                  </>
                )}
              </div>
            </Link>
          </ActionTooltip>
        </div>
        <Fragment key="isCollapse">
          <AnimatePresence mode="wait">
            {open && (
              <motion.div
                key={open ? "open" : "close"}
                initial={{
                  height: 0,
                  opacity: 0,
                }}
                animate={{
                  height: "auto",
                  opacity: 1,
                  transition: {
                    height: {
                      duration: 0.4,
                    },
                    opacity: {
                      duration: 0.25,
                      delay: 0.15,
                    },
                  },
                }}
                exit={{
                  height: 0,
                  transition: {
                    height: {
                      duration: 0.5,
                    },
                  },
                }}
                className="space-y-3"
              >
                <motion.div
                  initial={onEnter}
                  animate={animate}
                  exit={{ ...onLeave, transition: { delay: 0.2 } }}
                  transition={transitionSpringPhysics}
                >
                  <ActionTooltip side="right" align="center" label="Add a Server">
                    <button className="flex items-center group" onClick={() => onOpen("createServer")}>
                      <div className="flex items-center justify-center w-12 h-12 mx-3 overflow-hidden transition-all rounded-3xl group-hover:rounded-2xl bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
                        <Plus
                          className="transition group-hover:text-white text-emerald-500"
                          size={25}
                        />
                      </div>
                    </button>
                  </ActionTooltip>
                </motion.div>
                <motion.div
                  initial={onEnter}
                  animate={{ ...animate, transition: { delay: 0.2 } }}
                  exit={onLeave}
                  transition={transitionSpringPhysics}
                >
                  <ActionTooltip
                    side="right"
                    align="center"
                    label="Explore a Servers"
                  >
                    <Link href={"/explore"} className="relative flex items-center group">
                      <div className={cn(
                        "absolute left-0 bg-primary rounded-r-full transition-all w-1",
                        !pathname?.includes("explore") && "group-hover:h-5 group-hover:scale-100",
                        pathname?.includes("explore") ? "h-9" : "h-0 scale-0"
                      )} />
                      <div className={cn(
                        "relative group flex items-center justify-center mx-3 h-12 w-12 rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden bg-background dark:bg-neutral-700 group-hover:bg-emerald-500",
                        pathname?.includes("explore") && "bg-emerald-500 dark:bg-emerald-500 text-primary rounded-2xl"
                      )}>
                        <Compass
                          className={cn("transition group-hover:text-white text-emerald-500", pathname?.includes("explore") && "text-white")}
                          size={25}
                        />
                      </div>
                    </Link>
                  </ActionTooltip>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Fragment>
      </AnimatePresence>
      <Button variant="outline" type="button" size="icon" onClick={() => cycleOpen()} className={cn(open && "mt-3", "bg-transparent border-0")}>
        <ChevronDown
          className={cn(open && "rotate-180", "transition duration-500")}
        />
      </Button>
    </div>
  );
};
export default NavigationHeader;
