import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import "./globals.css";
import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';
import { theme } from "./theme";

export const metadata = {
  title: "Dịch Vụ Nam Long",
  description: "Công ty Nam Long cung cấp dịch vụ giáo dục",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
