"use client";
import React from "react";
import { useForm } from "@mantine/form";
import "dayjs/locale/vi";
import {
  Button,
  TextInput,
  Group,
  Space,
  Container,
  LoadingOverlay,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export default function SupplierForm({ loading, onSubmit }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const sizeInput = isMobile ? "xs" : "sm";

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {},

    validate: {
      tax_number: (value) => (value ? null : "Vui lòng nhập"),
      name: (value) => (value ? null : "Vui lòng nhập"),
    },
  });

  return (
    <Container size={sizeInput}>
      <LoadingOverlay visible={loading} />
      <form noValidate onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          label="Tên khách hàng"
          placeholder="Nhập tên"
          {...form.getInputProps("name")}
          required
          size={sizeInput}
        />
        <TextInput
          label="Mã số thuê"
          placeholder="Nhập mã số thuê"
          {...form.getInputProps("tax_number")}
          required
          size={sizeInput}
        />
        <TextInput
          label="Địa chỉ"
          placeholder="Nhập địa chỉ"
          {...form.getInputProps("address")}
          size={sizeInput}
        />

        <Space h="md" />

        <Group justify="right">
          <Button loading={loading} type="submit">
            Nộp
          </Button>
        </Group>
      </form>
    </Container>
  );
}
