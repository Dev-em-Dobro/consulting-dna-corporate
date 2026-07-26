// The real <html>/<body> shell lives in app/[locale]/layout.tsx (next-intl
// documented pattern). This root layout only forwards children.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
