import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type ButtonProps = ComponentProps<typeof Button>;

export function LinkButton({
  href,
  children,
  ...props
}: Omit<ButtonProps, "render"> & { href: string; children: React.ReactNode }) {
  return (
    <Button {...props} nativeButton={false} render={<Link href={href}>{children}</Link>} />
  );
}
