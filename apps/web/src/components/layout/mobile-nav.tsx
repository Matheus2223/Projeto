"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_GROUPS } from "@/config/nav";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="size-9 md:hidden" />}>
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="h-16 justify-center border-b border-border/70 px-4">
          <SheetTitle className="sr-only">TrendHub ISP AI</SheetTitle>
          <Logo />
        </SheetHeader>
        <nav className="no-scrollbar h-[calc(100dvh-4rem)] overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="mb-1.5 px-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {group.label}
              </p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13.5px] font-medium",
                          active
                            ? "bg-accent text-accent-foreground"
                            : "text-foreground/70 hover:bg-accent/60 hover:text-foreground",
                        )}
                      >
                        <item.icon className="size-[17px]" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
