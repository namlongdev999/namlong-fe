"use client";
import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function Layout({ children }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      // header={{ height: 60 }}
      // navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      {/* <AppShell.Header>
        <div>Logo doanh nghiệp</div>
      </AppShell.Header> */}

      {/* <AppShell.Navbar p="md">Danh sách chức năng</AppShell.Navbar> */}
      <AppShell.Main>{children}</AppShell.Main>
      {/* <div>{children}</div> */}
    </AppShell>
  );
}
