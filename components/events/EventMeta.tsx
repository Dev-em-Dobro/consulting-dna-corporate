import { CalendarDays, MapPin } from "lucide-react";
import type { LeadershipEvent } from "@/lib/events";

export default function EventMeta({ event }: { event: LeadershipEvent }) {
  return (
    <dl className="space-y-3 text-[13px] leading-[1.5] text-muted sm:text-[14px]">
      <div className="flex items-start gap-3">
        <dt><CalendarDays aria-hidden="true" className="mt-0.5 h-4 w-4 text-brand" strokeWidth={1.6} /><span className="sr-only">Date</span></dt>
        <dd>{event.dateLabel}</dd>
      </div>
      {event.location ? (
        <div className="flex items-start gap-3">
          <dt><MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 text-brand" strokeWidth={1.6} /><span className="sr-only">Location</span></dt>
          <dd>{event.location}</dd>
        </div>
      ) : null}
    </dl>
  );
}
