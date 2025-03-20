import { Suspense } from "react";

export const metadata = {
  title: "Dịch Vụ Nam Long",
  description: "Công ty Nam Long cung cấp dịch vụ giáo dục",
};

export default function RootLayout({ children }) {
  return <Suspense fallback={<div>...</div>}>{children}</Suspense>;
}
