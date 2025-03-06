"use client";
import React from "react";
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
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { randomId } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";

interface FormValue {
  supplier_name: string;
  supplier_tax: string;
  customer_name: string;
  customer_tax: string;
  total: number;
  price_tax: number;
  cash_back: number;
  signed_date: any;
  expenses: {
    title: string;
    desc: string;
    expense: number;
    key: string;
  }[];
}

interface Props {
  loading: boolean;
  onSubmit: (v: FormValue) => void;
}

export default function SupplierForm({ loading, onSubmit }: Props) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      supplier_name: "CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ GIÁO DỤC NAM LONG",
      supplier_tax: "",
      customer_name: "",
      customer_tax: "",
      total: 0,
      price_tax: 0,
      cash_back: 0,
      signed_date: dayjs().toDate(),
      expenses: [{ title: "", desc: "", expense: 0, key: randomId() }],
    },

    validate: {
      supplier_name: (value) => (value ? null : "Tên cung cấp là bắt buộc"),
      supplier_tax: (value) => (value ? null : "MST cung cấp là bắt buộc"),
      customer_name: (value) => (value ? null : "Tên khách hàng là bắt buộc"),
      customer_tax: (value) => (value ? null : "MST khách hàng là bắt buộc"),
      total: (value) => (value > 0 ? null : "Không hợp lê"),
      price_tax: (value) => (value > 0 ? null : "Không hợp lê"),
      cash_back: (value) => (value > 0 ? null : "Không hợp lê"),
      signed_date: (value) => (value ? null : "Ngày ký là bắt buộc"),
      expenses: {
        title: (value) => (value ? null : "Tiêu đề là bắt buộc"),
        expense: (value) => (value > 0 ? null : "Không hợp lê"),
      },
    },
  });

  const fields = form.getValues().expenses.map((item, index) => (
    <Group key={item.key} mt="xs" align="start">
      <TextInput
        placeholder="Tiêu đề"
        withAsterisk
        style={{ flex: 1 }}
        key={form.key(`expenses.${index}.title`)}
        {...form.getInputProps(`expenses.${index}.title`)}
      />
      <TextInput
        placeholder="Nội dung"
        withAsterisk
        style={{ flex: 1 }}
        key={form.key(`expenses.${index}.desc`)}
        {...form.getInputProps(`expenses.${index}.desc`)}
      />
      <NumberInput
        placeholder="Tổng"
        thousandSeparator=","
        withAsterisk
        style={{ flex: 1 }}
        key={form.key(`expenses.${index}.expense`)}
        {...form.getInputProps(`expenses.${index}.expense`)}
      />
      <ActionIcon
        color="red"
        onClick={() => form.removeListItem("expenses", index)}
      >
        <IconTrash size={16} />
      </ActionIcon>
    </Group>
  ));

  const handleSubmit = async (v: FormValue) => {
    onSubmit(v);
  };

  return (
    <Container size="sm">
      <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Tên cung cấp"
          placeholder="Tên cung cấp"
          key={form.key("supplier_name")}
          {...form.getInputProps("supplier_name")}
          required
        />

        <TextInput
          label="MST cung cấp"
          placeholder="MST cung cấp"
          key={form.key("supplier_tax")}
          {...form.getInputProps("supplier_tax")}
          required
        />

        <TextInput
          label="Tên khách hàng"
          placeholder="Tên khách hàng"
          {...form.getInputProps("customer_name")}
          required
        />

        <TextInput
          label="MST khách hàng"
          placeholder="MST khách hàng"
          {...form.getInputProps("customer_tax")}
          required
        />

        <NumberInput
          label="Tổng tiền"
          placeholder="Nhập số tiền"
          thousandSeparator=","
          {...form.getInputProps("total")}
          required
        />

        <NumberInput
          label="Thuế"
          placeholder="Nhập số tiền"
          thousandSeparator=","
          {...form.getInputProps("price_tax")}
          required
        />

        <NumberInput
          label="Gửi lại"
          placeholder="Nhập số tiền"
          thousandSeparator=","
          {...form.getInputProps("cash_back")}
        />

        <DateInput
          label="Ngày ký"
          placeholder="Nhập ngày ký"
          locale="vi"
          {...form.getInputProps("signed_date")}
          required
          valueFormat="DD/MM/YYYY"
        />
        <Text mt="xs" size="sm">
          Danh sách chi phí
        </Text>
        {fields}
        <Group justify="center" mt="md">
          <Button
            onClick={() =>
              form.insertListItem("expenses", {
                title: "",
                desc: "",
                expense: 0,
                key: randomId(),
              })
            }
          >
            Thêm chi phí
          </Button>
        </Group>

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
