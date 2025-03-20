"use client";
import React, { useEffect, useMemo, useState } from "react";
import InvoiceForm from "./components/Compose";
import {
  ActionIcon,
  Button,
  Combobox,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  NumberFormatter,
  Paper,
  Select,
  Space,
  Table,
  Text,
  Title,
  useCombobox,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useRestApi } from "../../../service/hook";
import Layout from "../../../components/Layout";
import { useQueryParams } from "../../../hooks/useQueryParams";
import dayjs from "dayjs";
import { useMediaQuery } from "@mantine/hooks";
import Detail from "./components/Detail";
import { MonthPickerInput } from "@mantine/dates";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

const Action = ({ onDetail, onEdit }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        combobox.closeDropdown();
      }}
      store={combobox}
      size="xs"
    >
      <Combobox.Target>
        <Button
          size="xs"
          onClick={onDetail}
          //  onClick={() => combobox.toggleDropdown()}
        >
          Xem
        </Button>
      </Combobox.Target>

      <Combobox.Dropdown className="!w-[80px]">
        <Combobox.Option onClick={onDetail} value="detail">
          Chi tiết
        </Combobox.Option>
        {/* <Combobox.Option onClick={onEdit} value="edit">
          Sửa
        </Combobox.Option> */}
      </Combobox.Dropdown>
    </Combobox>
  );
};
const Invoices = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [logData, handleLogData] = useState({ type: "", data: undefined });
  const { data, get, post, loading } = useRestApi();
  const {
    data: customerList,
    get: getCutomerList,
    loading: loadingCustomerList,
  } = useRestApi();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [filters = { date: dayjs().format("YYYY-MM-DD") }, changeFilters]: any =
    useQueryParams(["date", "customer"]);
  const params = new URLSearchParams(filters).toString();

  const handleClose = () => {
    close();
    handleLogData({ type: "", data: undefined });
  };

  const handleSubmit = async (values) => {
    try {
      const { cash_back, customer, signed_date, tax, total, expenses } = values;

      await post("/invoices", {
        customer,
        total,
        tax,
        cash_back,
        signed_date: dayjs(signed_date).toISOString(),
        expenses: expenses.map((v) => ({
          title: v.title,
          desc: v.desc,
          amount: v.amount,
          price: v.price,
          tax: v.tax,
        })),
      });
      handleClose();
      get("/invoices");
    } catch (e) {
      console.log(e);
    }
  };

  const rows = data?.map((v) => {
    const expense = v.expenses?.reduce(
      (t, r) => t + (r.amount * r.price - r.amount * r.price * (r.tax / 100)),
      0
    );
    return (
      <Table.Tr key={v._id}>
        <Table.Td>{v.customer_name}</Table.Td>
        <Table.Td>
          <NumberFormatter
            className="text-green-500 font-bold"
            value={v.revenue_total}
            thousandSeparator
            decimalScale={2}
          />
        </Table.Td>
        <Table.Td>
          <NumberFormatter value={v.total} thousandSeparator decimalScale={2} />
        </Table.Td>
        <Table.Td>
          <NumberFormatter
            value={v.total * (v.tax / 100)}
            thousandSeparator
            decimalScale={2}
          />
        </Table.Td>
        <Table.Td>
          <NumberFormatter value={expense} thousandSeparator decimalScale={2} />
        </Table.Td>
        <Table.Td>
          <NumberFormatter
            value={v.cash_back}
            thousandSeparator
            decimalScale={2}
          />
        </Table.Td>
        <Table.Td className="sticky right-0 z-10 bg-sky-50 text-center">
          <Action
            onDetail={() => {
              open();
              handleLogData({ type: "detail", data: v });
            }}
            onEdit={() => handleLogData({ type: "edit", data: v })}
          />
        </Table.Td>
      </Table.Tr>
    );
  });

  const overviewData = useMemo(() => {
    return (
      data?.reduce(
        (t, v) => ({
          total: t.total + v.total,
          revenueTotal: t.revenueTotal + v.revenue_total,
        }),
        { total: 0, revenueTotal: 0 }
      ) ?? { total: 0, revenueTotal: 0 }
    );
  }, [JSON.stringify(data)]);

  const handleChangeDate = (d) => {
    changeFilters({ ...filters, date: dayjs(d).format("YYYY-MM-DD") });
  };

  const handleChangeCustomer = (c) => {
    changeFilters({ ...filters, customer: c });
  };

  useEffect(() => {
    get(`/invoices?${params}`);
  }, [params]);

  useEffect(() => {
    getCutomerList("/customers");
  }, []);

  return (
    <Layout>
      <LoadingOverlay visible={loading || loadingCustomerList} />
      <Flex direction="row" justify="space-between" align="center">
        <Title className="text-blue-500">Danh sách hóa đơn</Title>

        {isMobile ? (
          <ActionIcon
            variant="outline"
            size="lg"
            aria-label="Create"
            onClick={open}
          >
            <IconPlus />
          </ActionIcon>
        ) : (
          <Button leftSection={<IconPlus />} variant="outline" onClick={open}>
            Tạo mới hóa đơn
          </Button>
        )}
      </Flex>
      <Space h="md" />

      <Flex gap="md" pos="relative">
        <MonthPickerInput
          label="Tháng ký HD"
          monthsListFormat="MM"
          valueFormat="MM/YYYY"
          placeholder="Tháng ký HD"
          defaultValue={dayjs(filters.date).toDate()}
          onChange={handleChangeDate}
        />
        <Select
          label="Tên khách hàng"
          placeholder="Tên khách hàng"
          data={customerList?.map((v) => ({
            value: v.tax_number,
            label: v.name,
          }))}
          value={filters?.customer}
          onChange={handleChangeCustomer}
          clearable
        />
      </Flex>
      <Space h="md" />
      <Flex gap="md">
        <Paper shadow="xs" withBorder p="xs" radius="md" className="w-52">
          <Text size="sm">Tổng tiền</Text>
          <Group gap="xs">
            <NumberFormatter
              suffix=" VND"
              className="text-lg font-semibold text-red-500"
              value={overviewData.total}
              thousandSeparator
              decimalScale={2}
            />
          </Group>
        </Paper>
        <Paper shadow="xs" withBorder p="xs" radius="md" className="w-52">
          <Text size="sm">Tổng tiền còn lại</Text>
          <Group gap="xs">
            <NumberFormatter
              suffix=" VND"
              className="text-lg font-semibold text-green-500"
              value={overviewData.revenueTotal}
              thousandSeparator
              decimalScale={2}
            />
          </Group>
        </Paper>
      </Flex>
      <Space h="md" />

      <Table.ScrollContainer minWidth={1080} h={500}>
        <Table
          withTableBorder
          stickyHeader
          highlightOnHover
          highlightOnHoverColor="#f0f9ff"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="w-[240px]">Tên khách hàng</Table.Th>
              <Table.Th className="w-[140px]">Tổng còn lại</Table.Th>
              <Table.Th className="w-[140px]">Tổng tiền</Table.Th>
              <Table.Th className="w-[140px]">Tiền thuế</Table.Th>
              <Table.Th className="w-[140px]">Tổng chi phí</Table.Th>
              <Table.Th className="w-[140px]">Gửi lại</Table.Th>
              <Table.Th className="w-[100px] sticky right-0 z-10 bg-sky-50 !text-center">
                Thao tác
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Modal
        opened={opened}
        onClose={handleClose}
        title={
          <Text c="blue" fw={700} size="lg">
            {logData.type === "detail" ? "Chi tiết nội dung" : "Tạo mới"}
          </Text>
        }
        fullScreen={!!isMobile}
        size="80%"
      >
        {logData.type === "detail" ? (
          <Detail data={logData.data} />
        ) : (
          <InvoiceForm loading={loading} onSubmit={handleSubmit} />
        )}
      </Modal>
    </Layout>
  );
};
export default Invoices;
