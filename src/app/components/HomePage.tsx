"use client";
// import Sidebar from "../components/Sidebar";
import { Card, Text, Title, Progress, Button, Grid } from "@mantine/core";
import Header from "./Header";
import Footer from "./Footer";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Chương trình ICDL lớp 1",
    desc: "MÔ-ĐUN: INTRODUCTION TO CODING 1 - LÀM QUEN VỚI LẬP TRÌNH 1",
    tag: "70 tiết",
    image: "/product.png",
  },
  {
    id: 2,
    name: "Chương trình ICDL lớp 2",
    desc: "MÔ-ĐUN: INTRODUCTION TO CODING 1 - LÀM QUEN VỚI LẬP TRÌNH 2",
    tag: "70 tiết",
    image: "/product.png",
  },
  {
    id: 3,
    name: "Chương trình ICDL lớp 3",
    desc: "MÔ-ĐUN: LÀM QUEN VỚI THẾ GIỚI SỐ (FIRST STEPS)",
    tag: "70 tiết",
    image: "/product.png",
  },
  {
    id: 4,
    name: "Chương trình ICDL lớp 4",
    desc: "MÔ-ĐUN: LÀM QUEN VỚI CÁC ỨNG DỤNG MÁY TÍNH (APPLICATION BASICS)",
    tag: "70 tiết",
    image: "/product.png",
  },
  {
    id: 5,
    name: "Chương trình ICDL lớp 5",
    desc: "MÔ-ĐUN: LÀM QUEN VỚI MẠNG TRỰC TUYẾN (ONLINE BASICS)",
    tag: "70 tiết",
    image: "/product.png",
  },
];

export default function Dashboard() {
  return (
    <div className="w-full max-w-[1440px] m-auto">
      <Header />
      <main className="flex flex-col">
        <section className="relative">
          <div className="bg-white aspect-[16/9] h-[90%]">
            <Image
              src="/banner3.jpg"
              alt="Hero Banner"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col justify-center items-center">
            <Title order={1} className="text-[#153e6d] !text-6xl">
              GIÁO DỤC NAM LONG
            </Title>
            {/* <p className="text-xl mt-2">Chương trình ICDL lớp 1-5</p> */}
          </div>
        </section>

        <section className="p-8 text-center bg-[#153e6d]">
          <Title order={2} className="text-white pb-8 !text-4xl">
            Các Chương Trình Học
          </Title>
          {/* <h2 className="text-3xl font-bold text-primary text-white">Các chương trình học</h2> */}
          <Grid
            justify="center"
            gutter="lg"
            styles={{ inner: { alignItems: "stretch" } }}
          >
            {products.map((product) => (
              <Grid.Col key={product.id} span={4}>
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  className="items-center h-full"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    height={180}
                    width={180}
                  />
                  <Text size="xl" fw={700} className="!text-blue-600">
                    {product.name}
                  </Text>
                  <Text className="w-[80%]" fw={400}>{product.desc}</Text>
                  <Button className="mt-4" color="blue">
                    Số tiết: {product.tag}
                  </Button>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </section>
      </main>
      <Footer />
    </div>
  );
}
