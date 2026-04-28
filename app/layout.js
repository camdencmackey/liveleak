// app/layout.js
import "./globals.css";

export const metadata = {
  title: "LiveLeak.com - LIVELEAK",
  description: "LIVELEAK band portal"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}