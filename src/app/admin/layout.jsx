import { ModalsProvider } from "@mantine/modals";

export default function RootLayout({ children }) {
  return <ModalsProvider>{children}</ModalsProvider>
}
