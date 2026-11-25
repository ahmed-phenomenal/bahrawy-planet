"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { PENDING_KEY, scrollToSection } from "@/lib/scroll";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { section: string };

// A link to a section of the home page that never puts #section in the address bar
export default function SectionLink({ section, onClick, ...rest }: Props) {
  const pathname = usePathname();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

    if (pathname === "/") {
      e.preventDefault();
      scrollToSection(section);
    } else {
      // Another page: go to "/" and let the Navbar scroll after it loads
      try {
        sessionStorage.setItem(PENDING_KEY, section);
      } catch {}
    }
  };

  return <Link href="/" {...rest} onClick={handleClick} />;
}