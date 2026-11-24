/** Remove a sentence-ending period without damaging ellipses or initials like U.K. */
export function sectionHeading(text: string): string {
  if (/(?:\.\.|\b(?:[A-Za-z]\.){2,})\s*$/.test(text)) return text;
  return text.replace(/\.(\s*)$/, "$1");
}
