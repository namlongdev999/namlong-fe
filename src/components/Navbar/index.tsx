import {
  IconFileDollar,
  IconMoneybag,
  IconUsersGroup,
} from "@tabler/icons-react";
import { NavLink, ScrollArea } from "@mantine/core";
import "./index.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavbarNested() {
  const pathname = usePathname();

  const navLinks = [
    {
      href: "/admin/invoices",
      label: "Danh sách hóa đơn",
      icon: <IconFileDollar size={16} />,
    },
    {
      href: "/admin/investments",
      label: "Danh sách đầu tư",
      icon: <IconMoneybag size={16} />,
    },
    {
      href: "/admin/customers",
      label: "Danh sách khách hàng",
      icon: <IconUsersGroup size={16} />,
    },
  ];

  return (
    <nav className="navbar">
      <ScrollArea className="links">
        {navLinks.map((v) => (
          <NavLink
            className={`${
              pathname === v.href ? "!bg-sky-100" : "hover:bg-gray-700"
            }`}
            key={v.href}
            href={v.href}
            label={v.label}
            component={Link}
            leftSection={v.icon}
          />
        ))}
        {/* <NavLink
          href="#required-for-focus"
          label="First parent link"
          leftSection={<IconGauge size={16} stroke={1.5} />}
          childrenOffset={28}
        >
          <NavLink href="#required-for-focus" label="First child link" />
          <NavLink label="Second child link" href="#required-for-focus" />
          <NavLink
            label="Nested parent link"
            childrenOffset={28}
            href="#required-for-focus"
          >
            <NavLink label="First child link" href="#required-for-focus" />
            <NavLink label="Second child link" href="#required-for-focus" />
            <NavLink label="Third child link" href="#required-for-focus" />
          </NavLink>
        </NavLink> */}
      </ScrollArea>
    </nav>
  );
}
