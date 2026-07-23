/** Neutral image slot for scaffolded pages — swap for a real <Image> later. */
export default function ImagePlaceholder({
  className = "",
  label = "Image",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={
        "flex items-center justify-center border border-line bg-paper text-[11px] font-semibold uppercase tracking-[2px] text-ink/40 " +
        className
      }
    >
      {label}
    </div>
  );
}
