import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "nwdesigns - Digital Marketing Campaigns",
  description: "Campagne di marketing digitale per brand di lusso e PMI italiane",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
