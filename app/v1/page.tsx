import { redirect } from "next/navigation";

// The homepage now lives at the site root. Keep /v1 working (old links,
// bookmarks) by redirecting it to the canonical home.
export default function V1Redirect() {
  redirect("/");
}
