import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation. `Link` auto-prefixes the active locale, so pages keep
 * writing relative hrefs (`/solutions`) and get `/pt/solutions` for free.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
