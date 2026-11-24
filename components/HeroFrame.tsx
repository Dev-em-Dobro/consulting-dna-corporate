import type { ComponentPropsWithRef } from "react";

type HeroFrameProps = ComponentPropsWithRef<"section"> & {
  size?: "standard" | "screen" | "content";
};

export default function HeroFrame({
  size = "standard",
  className = "",
  ...props
}: HeroFrameProps) {
  const height = { standard: "min-h-[84svh]", screen: "min-h-svh", content: "" }[size];
  return <section {...props} data-page-hero className={`relative isolate overflow-hidden bg-ink text-white ${height} ${className}`} />;
}
