"use client";
import { forwardRef } from "react";
import {
  Group,
  Avatar,
  Text,
  Menu,
  UnstyledButton,
  Button,
} from "@mantine/core";
import { IconLogout2, IconTrash } from "@tabler/icons-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const UserButton = forwardRef(
  ({ image, name, email, icon, ...others }, ref) => (
    <UnstyledButton
      ref={ref}
      style={{
        color: "var(--mantine-color-text)",
        borderRadius: "var(--mantine-radius-sm)",
      }}
      {...others}
    >
      <Group gap="xs">
        <Avatar color="cyan" radius="xl">
          AD
        </Avatar>
      </Group>
    </UnstyledButton>
  )
);

function UserButtonMenu() {
  const { push } = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    push("/admin");
  };

  return (
    <Menu withArrow>
      <Menu.Target>
        <UserButton
          image="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
          name="Harriette Spoonlicker"
          email="hspoonlicker@outlook.com"
        />
      </Menu.Target>
      {/* ... menu items */}
      <Menu.Dropdown>
        <Menu.Item
          onClick={handleLogout}
          color="red"
          leftSection={<IconLogout2 size={12} />}
        >
          Thoát
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default UserButtonMenu;
