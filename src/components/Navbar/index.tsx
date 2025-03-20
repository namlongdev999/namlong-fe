import {
  IconAdjustments,
  IconCalendarStats,
  IconFileAnalytics,
  IconFingerprint,
  IconGauge,
  IconLock,
  IconNotes,
  IconPresentationAnalytics,
} from "@tabler/icons-react";
import { Code, Group, NavLink, ScrollArea } from "@mantine/core";
import "./index.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

const mockdata = [
  { label: "Dashboard", icon: IconGauge },
  {
    label: "Market news",
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: "Overview", link: "/" },
      { label: "Forecasts", link: "/" },
      { label: "Outlook", link: "/" },
      { label: "Real time", link: "/" },
    ],
  },
  {
    label: "Releases",
    icon: IconCalendarStats,
    links: [
      { label: "Upcoming releases", link: "/" },
      { label: "Previous releases", link: "/" },
      { label: "Releases schedule", link: "/" },
    ],
  },
  { label: "Analytics", icon: IconPresentationAnalytics },
  { label: "Contracts", icon: IconFileAnalytics },
  { label: "Settings", icon: IconAdjustments },
  {
    label: "Security",
    icon: IconLock,
    links: [
      { label: "Enable 2FA", link: "/" },
      { label: "Change password", link: "/" },
      { label: "Recovery codes", link: "/" },
    ],
  },
];

export function NavbarNested() {
  const { push } = useRouter();
  // const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);

  return (
    <nav className="navbar">
      <ScrollArea className="links">
          <NavLink href="/admin/invoices" label="Danh sách hóa đơn"  component={Link}/>
          <NavLink href="/admin/investments" label="Danh sách đầu tư" component={Link}/>
          <NavLink href="/admin/customers" label="Danh sách khách hàng" component={Link}/>
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
