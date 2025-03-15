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
  Grid,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { randomId, useDebouncedCallback } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";

interface FormValue {
  supplier_name: string;
  supplier_tax: string;
  customer_name: string;
  customer_tax: string;
  total: number;
  tax: number;
  cash_back: number;
  signed_date: any;
  expenses: {
    title: string;
    desc: string;
    price: number;
    tax: number;
    amount: number;
    total?: number;
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
      tax: 10,
      cash_back: 0,
      signed_date: dayjs().toDate(),
      expenses: [
        {
          title: "",
          desc: "",
          amount: 0,
          price: 0,
          tax: 10,
          total: undefined,
          key: randomId(),
        },
      ],
    },

    validate: {
      supplier_name: (value) => (value ? null : "Vui lòng nhập"),
      supplier_tax: (value) => (value ? null : "Vui lòng nhập"),
      customer_name: (value) => (value ? null : "Vui lòng nhập"),
      customer_tax: (value) => (value ? null : "Vui lòng nhập"),
      total: (value) => (value > 0 ? null : "Không hợp lê"),
      tax: (value) => (value >= 0 ? null : "Không hợp lê"),
      cash_back: (value) => (value > 0 ? null : "Không hợp lê"),
      signed_date: (value) => (value ? null : "Vui lòng nhập"),
      expenses: {
        title: (value) => (value ? null : "Vui lòng nhập"),
        price: (value) => (value > 0 ? null : "Không hợp lê"),
        amount: (value) => (value > 0 ? null : "Không hợp lê"),
      },
    },
    // onValuesChange: (value, a) => {
    //   console.log(value, a);

    // },
    // transformValues: (values) => ({
    //   expenses: values.expenses.map((item) => ({
    //     ...item,
    //     total1: item.price, // Transform input2 based on input1
    //   })),
    // }),
  });

  const handleTotalPriceChange = useDebouncedCallback(
    (index: number, key: string, value: number) => {
      const tax = form.getValues().expenses[index]?.tax || 0;
      const price = form.getValues().expenses[index]?.price || 0;
      const amount = form.getValues().expenses[index]?.amount || 0;
      switch (key) {
        case "amount":
          form.setFieldValue(
            `expenses.${index}.total`,
            value * price - value * price * (tax / 100)
          );
          break;
        case "price":
          form.setFieldValue(
            `expenses.${index}.total`,
            value * amount - value * amount * (tax / 100)
          );
          break;
        case "tax":
          form.setFieldValue(
            `expenses.${index}.total`,
            price * amount - price * amount * (value / 100)
          );
          break;
        default:
          break;
      }
    },
    500
  );

  const fields = form.getValues().expenses.map((item, index) => {
    const { onChange: onChangePriceField, ...priceField } = {
      ...form.getInputProps(`expenses.${index}.price`),
    };
    const { onChange: onChangeTaxField, ...taxField } = {
      ...form.getInputProps(`expenses.${index}.tax`),
    };
    const { onChange: onChangeAmountField, ...amountField } = {
      ...form.getInputProps(`expenses.${index}.amount`),
    };
    return (
      <Grid key={index}>
        <Grid.Col span="auto">
          <Grid>
            <Grid.Col span="auto">
              <TextInput
                placeholder="Tiêu đề"
                withAsterisk
                style={{ flex: 1 }}
                key={form.key(`expenses.${index}.title`)}
                {...form.getInputProps(`expenses.${index}.title`)}
              />
            </Grid.Col>
            <Grid.Col span="auto">
              <NumberInput
                placeholder="Số lượng"
                thousandSeparator=","
                withAsterisk
                style={{ flex: 1 }}
                key={form.key(`expenses.${index}.amount`)}
                {...amountField}
                onChange={(value) => {
                  onChangeAmountField(value);
                  handleTotalPriceChange(index, "amount", value as number);
                }}
              />
            </Grid.Col>
            <Grid.Col span="auto">
              <NumberInput
                placeholder="Tiền"
                thousandSeparator=","
                withAsterisk
                style={{ flex: 1 }}
                key={form.key(`expenses.${index}.price`)}
                {...priceField}
                hideControls
                onChange={(value) => {
                  onChangePriceField(value);
                  handleTotalPriceChange(index, "price", value as number);
                }}
              />
            </Grid.Col>
            <Grid.Col span="auto">
              <NumberInput
                placeholder="Thuế"
                thousandSeparator=","
                withAsterisk
                style={{ flex: 1 }}
                key={form.key(`expenses.${index}.tax`)}
                {...taxField}
                min={0}
                max={100}
                suffix="%"
                hideControls
                onChange={(value) => {
                  onChangeTaxField(value);
                  handleTotalPriceChange(index, "tax", value as number);
                }}
              />
            </Grid.Col>
            <Grid.Col span="auto">
              <NumberInput
                placeholder="Tổng"
                thousandSeparator=","
                withAsterisk
                style={{ flex: 1 }}
                key={form.key(`expenses.${index}.total`)}
                {...form.getInputProps(`expenses.${index}.total`)}
                readOnly
                hideControls
              />
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span="content">
          <ActionIcon
            color="red"
            onClick={() => form.removeListItem("expenses", index)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Grid.Col>
      </Grid>
    );
  });

  const handleSubmit = async (v: FormValue) => {
    onSubmit(v);
  };

  return (
    <Container size="md">
      <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
        {/* <TextInput
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
        /> */}

        <TextInput
          label="Tên khách hàng"
          placeholder="Tên khách hàng"
          {...form.getInputProps("customer_name")}
          required
        />

        {/* <TextInput
          label="MST khách hàng"
          placeholder="MST khách hàng"
          {...form.getInputProps("customer_tax")}
          required
        /> */}

        <NumberInput
          label="Tổng tiền"
          placeholder="Nhập số tiền"
          thousandSeparator=","
          {...form.getInputProps("total")}
          required
          hideControls
        />

        {/* <NumberInput
          label="Thuế"
          placeholder="Nhập số tiền"
          thousandSeparator=","
          {...form.getInputProps("tax")}
          required
          hideControls
        /> */}

        <NumberInput
          label="Thuế"
          placeholder="Nhập số tiền"
          thousandSeparator=","
          style={{ flex: 1 }}
          {...form.getInputProps("tax")}
          min={0}
          max={100}
          suffix="%"
          required
          hideControls
          // onChange={(value) => {
          //   onChangeTaxField(value);
          //   handleTaxChange(index, value as number);
          // }}
        />

        <NumberInput
          label="Gửi lại"
          placeholder="Nhập số tiền"
          thousandSeparator=","
          {...form.getInputProps("cash_back")}
          hideControls
        />

        <DateInput
          label="Ngày ký"
          placeholder="Nhập ngày ký"
          locale="vi"
          {...form.getInputProps("signed_date")}
          required
          valueFormat="DD/MM/YYYY"
        />
        <Text fw={600} mt="xs" size="sm">
          Danh sách chi phí
        </Text>
        <Grid>
          <Grid.Col span="auto">
            <Grid>
              <Grid.Col span="auto">
                <Text mt="xs" size="sm">
                  Tiêu đề
                </Text>
              </Grid.Col>
              <Grid.Col span="auto">
                <Text mt="xs" size="sm">
                  Số lượng
                </Text>
              </Grid.Col>
              <Grid.Col span="auto">
                <Text mt="xs" size="sm">
                  Tiền
                </Text>
              </Grid.Col>
              <Grid.Col span="auto">
                <Text mt="xs" size="sm">
                  Thuế
                </Text>
              </Grid.Col>
              <Grid.Col span="auto">
                <Text mt="xs" size="sm">
                  Tổng
                </Text>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span="content">
            <div className="w-[26px]"></div>
          </Grid.Col>
        </Grid>

        {fields}
        <Group justify="center" mt="md">
          <Button
            onClick={() =>
              form.insertListItem("expenses", {
                title: "",
                desc: "",
                price: 0,
                tax: 10,
                amount: 0,
                total: 0,
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
