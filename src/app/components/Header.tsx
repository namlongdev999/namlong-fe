"use client";
import { Title } from "@mantine/core";
import { IconContract } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 bg-[#153e6d] px-6 py-4 flex items-center z-50 shadow-md">
      <Link href={"/"}>
        <Image src="/logo.png" width={64} height={64} alt="Logo" />
      </Link>
      <nav className="ml-[240px] md:flex gap-8">
        <Link href={"/"}>
          <Title className="text-blue-300" order={4}>
            Trang chủ
          </Title>
        </Link>
        {/* <Link href={"/"}>
          <Title c="gray" order={4}>
            Giới thiệu
          </Title>
        </Link> */}

        <Title
          className="cursor-pointer"
          c="white"
          order={4}
          onClick={() => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          }}
        >
          Liên hệ
        </Title>
      </nav>
    </header>
  );
};

export default Header;
