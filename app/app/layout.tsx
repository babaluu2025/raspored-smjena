export const metadata = {
  title: "Raspored Smjena",
  description: "Aplikacija za raspored smjena",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sr">
      <body>{children}</body>
    </html>
  );
}
