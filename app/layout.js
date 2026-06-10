import "./globals.css";

export const metadata = {
  title: "Shadow Mirror AI — Subconscious Scanner",
  description: "Advanced Jungian Persona and Shadow Diagnosis Scanner",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Shadow Mirror",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-void antialiased">{children}</body>
    </html>
  );
}