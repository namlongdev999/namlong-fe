"use client";
import React, { useEffect } from "react";
import { useForm } from "@mantine/form";
import "dayjs/locale/vi";
import {
  Button,
  TextInput,
  NumberInput,
  Group,
  Space,
  Container,
  ActionIcon,
  Grid,
  Select,
  LoadingOverlay,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDebouncedCallback, useMediaQuery } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useRestApi } from "../../../../../service/hook";

export default function SupplierForm({ loading, onSubmit }) {
  const {
    data: customerList,
    get,
    loading: loadingCustomerList,
  } = useRestApi();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const sizeInput = isMobile ? "xs" : "sm";

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      customer_tax: "",
      investment_total: 0,
      from_date: dayjs().toDate(),
      to_date: dayjs().toDate(),
    },

    validate: {
      customer_tax: (value) => (value ? null : "Vui lòng nhập"),
      investment_total: (value) => (value > 0 ? null : "Không hợp lê"),
      from_date: (value) => (value ? null : "Vui lòng nhập"),
      to_date: (value) => (value ? null : "Vui lòng nhập"),
    },
  });

  useEffect(() => {
    get("/customers");
  }, []);

  return (
    <Container size={sizeInput}>
      <LoadingOverlay visible={loadingCustomerList || loading} />
      <form noValidate onSubmit={form.onSubmit(onSubmit)}>
        <Select
          label="Tên khách hàng"
          placeholder="Tên khách hàng"
          data={customerList?.map((v) => ({
            value: v.tax_number,
            label: v.name,
          }))}
          {...form.getInputProps("customer_tax")}
          required
          maxDropdownHeight={200}
          searchable
          size={sizeInput}
        />

        <NumberInput
          label="Tổng tiền đầu tư"
          placeholder="Nhập số tiền"
          thousandSeparator=","
          {...form.getInputProps("investment_total")}
          required
          hideControls
          size={sizeInput}
        />

        <DateInput
          label="Ngày đầu tư"
          placeholder="Nhập ngày"
          locale="vi"
          {...form.getInputProps("from_date")}
          required
          valueFormat="DD/MM/YYYY"
          size={sizeInput}
        />
        <DateInput
          label="Ngày kết thúc"
          placeholder="Nhập ngày"
          locale="vi"
          {...form.getInputProps("to_date")}
          required
          valueFormat="DD/MM/YYYY"
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
