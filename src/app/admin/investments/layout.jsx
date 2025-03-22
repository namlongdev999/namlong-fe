import { LoadingOverlay } from "@mantine/core";
import { Suspense } from "react";

export default function RootLayout({ children }) {
  return <Suspense fallback={<LoadingOverlay visible />}>{children}</Suspense>;
}
