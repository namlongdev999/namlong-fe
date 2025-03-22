"use client";
import React, { use, useEffect } from "react";
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
  Select,
  LoadingOverlay,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { randomId, useDebouncedCallback, useMediaQuery } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useRestApi } from "../../../../../service/hook";
import RestAPI from "../../../../../service";

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
      customer: "",
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
      customer: (value) => (value ? null : "Vui lòng nhập"),
      total: (value) => (value > 0 ? null : "Không hợp lê"),
      tax: (value) => (value >= 0 ? null : "Không hợp lê"),
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

  const handleTotalPriceChange = useDebouncedCallback((index, key, value) => {
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
  }, 500);

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
      <Grid key={index} gutter="xs">
        <Grid.Col span="auto">
          <Grid gutter="xs">
            <Grid.Col span="auto">
              <TextInput
                placeholder="Tiêu đề"
                withAsterisk
                style={{ flex: 1 }}
                key={form.key(`expenses.${index}.title`)}
                {...form.getInputProps(`expenses.${index}.title`)}
                size={sizeInput}
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
                  handleTotalPriceChange(index, "amount", value);
                }}
                size={sizeInput}
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
                  handleTotalPriceChange(index, "price", value);
                }}
                size={sizeInput}
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
                  handleTotalPriceChange(index, "tax", value);
                }}
                size={sizeInput}
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
                size={sizeInput}
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

  useEffect(() => {
    get("/customers");
  }, []);

  return (
    <Container size="md">
      <LoadingOverlay visible={loadingCustomerList || loading} />
      <form noValidate onSubmit={form.onSubmit(onSubmit)}>
        <Select
          label="Tên khách hàng"
          placeholder="Tên khách hàng"
          data={customerList?.map((v) => ({
            value: v.tax_number,
            label: v.name,
          }))}
          {...form.getInputProps("customer")}
          required
          maxDropdownHeight={200}
          searchable
          size={sizeInput}
        />

        <NumberInput
          label="Tổng tiền"
          placeholder="Nhập số tiền"
          thousandSeparator=","
          {...form.getInputProps("total")}
          required
          hideControls
          size={sizeInput}
        />

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
          size={sizeInput}
        />

        <NumberInput
          label="Gửi lại"
          placeholder="Nhập số tiền"
          thousandSeparator=","
          {...form.getInputProps("cash_back")}
          hideControls
          size={sizeInput}
        />

        <DateInput
          label="Ngày ký"
          placeholder="Nhập ngày ký"
          locale="vi"
          {...form.getInputProps("signed_date")}
          required
          valueFormat="DD/MM/YYYY"
          size={sizeInput}
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
            size={sizeInput}
          >
            Thêm chi phí
          </Button>
        </Group>

        <Space h="md" />

        <Group justify="right">
          <Button loading={loading} type="submit" size={sizeInput}>
            Nộp
          </Button>
        </Group>
      </form>
    </Container>
  );
}
