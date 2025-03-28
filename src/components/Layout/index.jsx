"use client";
import { AppShell, Burger, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import Link from "next/link";
import { NavbarNested } from "../Navbar";
import UserButtonMenu from "../UserButton";

export default function Layout({ children }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: "74px" }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <div className="p-3">
          <Flex justify="space-between">
            <Link href="/admin/invoices">
              <Image src="/logo.png" width={50} height={50} alt="Logo" />
            </Link>
            <UserButtonMenu />
          </Flex>
        </div>
      </AppShell.Header>

      <AppShell.Navbar>
        <NavbarNested />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
      {/* <div>{children}</div> */}
    </AppShell>
  );
}
