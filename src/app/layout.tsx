import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "果物キング — Fruit King",
  description:
    "日本各地の旬の果物を生産者から直接お届けするマーケット — Fruit King",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
