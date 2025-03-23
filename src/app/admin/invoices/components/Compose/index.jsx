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

export default function ComposeForm({ data, loading, onSubmit }) {
  const {
    data: customerList,
    get,
    loading: loadingCustomerList,
  } = useRestApi();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const sizeInput = isMobile ? "xs" : "sm";

  const isEdit = !!data?._id;

  const defaultValue = data
    ? {
        id: data._id,
        customer: data?.customer_tax,
        total: data?.total ?? 0,
        tax: data?.tax ?? 10,
        cash_back: data?.cash_back ?? 10,
        signed_date: data?.signed_date
          ? dayjs(data.signed_date).toDate()
          : dayjs().toDate(),
        expenses: data?.expenses?.map((v) => ({
          title: v.title,
          desc: v.desc,
          amount: v.amount,
          price: v.price,
          tax: v.tax,
          total: v.price * v.amount,
          total_receive:
            v.price * v.amount - v.price * v.amount * (v.tax / 100),
          id: v._id,
        })),
      }
    : {
        customer: "",
        total: 0,
        tax: 10,
        cash_back: 10,
        signed_date: dayjs().toDate(),
        expenses: [
          {
            title: "",
            desc: "",
            amount: 0,
            price: 120000,
            tax: 10,
            total: 0,
            total_receive: 0,
            key: randomId(),
          },
        ],
      };

  const form = useForm({
    mode: "uncontrolled",
    initialValues: defaultValue,

    validate: {
      customer: (value) => (value ? null : "Vui lòng nhập"),
      total: (value) => (value > 0 ? null : "Không hợp lê"),
      tax: (value) => (value != undefined && value >= 0 ? null : "Không hợp lê"),
      cash_back: (value) => (value != undefined && value >= 0 ? null : "Không hợp lê"),
      signed_date: (value) => (value ? null : "Vui lòng nhập"),
      expenses: {
        title: (value) => (value ? null : "Vui lòng nhập"),
        price: (value) => (value > 0 ? null : "Không hợp lê"),
        amount: (value) => (value > 0 ? null : "Không hợp lê"),
      },
    },
  });

  const handleTotalPriceChange = useDebouncedCallback((index, key, value) => {
    const tax = form.getValues().expenses[index]?.tax || 0;
    const price = form.getValues().expenses[index]?.price || 0;
    const amount = form.getValues().expenses[index]?.amount || 0;
    switch (key) {
      case "amount":
        form.setFieldValue(
          `expenses.${index}.total_receive`,
          value * price - value * price * (tax / 100)
        );
        form.setFieldValue(`expenses.${index}.total`, value * price);
        break;
      case "price":
        form.setFieldValue(
          `expenses.${index}.total_receive`,
          value * amount - value * amount * (tax / 100)
        );
        form.setFieldValue(`expenses.${index}.total`, value * amount);
        break;
      case "tax":
        form.setFieldValue(
          `expenses.${index}.total_receive`,
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
                withAsterisk
                style={{ flex: 1 }}
                key={form.key(`expenses.${index}.title`)}
                {...form.getInputProps(`expenses.${index}.title`)}
                size={sizeInput}
              />
            </Grid.Col>
            <Grid.Col span="auto">
              <NumberInput
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
            <Grid.Col span="auto">
              <NumberInput
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
                thousandSeparator=","
                withAsterisk
                style={{ flex: 1 }}
                key={form.key(`expenses.${index}.total_receive`)}
                {...form.getInputProps(`expenses.${index}.total_receive`)}
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
    !data && get("/customers");
  }, []);

  const customerListDefault = data
    ? [{ tax_number: data.customer_tax, name: data.customer_name }]
    : customerList;

  return (
    <Container size="md">
      <LoadingOverlay visible={(!data && loadingCustomerList) || loading} />
      <form noValidate onSubmit={form.onSubmit(onSubmit)}>
        <Select
          label="Tên khách hàng"
          placeholder="Tên khách hàng"
          data={customerListDefault?.map((v) => ({
            value: v.tax_number,
            label: v.name,
          }))}
          {...form.getInputProps("customer")}
          required
          maxDropdownHeight={200}
          searchable
          size={sizeInput}
          disabled={isEdit}
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
          label="Thuế VAT (%)"
          style={{ flex: 1 }}
          {...form.getInputProps("tax")}
          min={0}
          max={100}
          suffix="%"
          hideControls
          size={sizeInput}
        />

        <NumberInput
          label="Gửi lại (%)"
          style={{ flex: 1 }}
          {...form.getInputProps("cash_back")}
          min={0}
          max={100}
          suffix="%"
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
                  Tên nhân viên
                </Text>
              </Grid.Col>
              <Grid.Col span="auto">
                <Text mt="xs" size="sm">
                  Số tiết
                </Text>
              </Grid.Col>
              <Grid.Col span="auto">
                <Text mt="xs" size="sm">
                  Lương theo tiết
                </Text>
              </Grid.Col>
              <Grid.Col span="auto">
                <Text mt="xs" size="sm">
                  Tổng lương
                </Text>
              </Grid.Col>
              <Grid.Col span="auto">
                <Text mt="xs" size="sm">
                  Thuế TNCN
                </Text>
              </Grid.Col>
              <Grid.Col span="auto">
                <Text mt="xs" size="sm">
                  Tổng lương nhận
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
                price: 120000,
                tax: 10,
                amount: 0,
                total: 0,
                total_receive: 0,
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
