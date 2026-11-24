import type { ComponentProps } from "react";
import { sectionHeading } from "@/lib/section-heading";

export default function SectionHeading({ children, ...props }: ComponentProps<"h2">) {
  return (
    <h2 {...props} data-section-heading>
      {typeof children === "string" ? sectionHeading(children) : children}
    </h2>
  );
}
