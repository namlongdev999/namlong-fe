"use client";
import React, { useEffect, useMemo, useState } from "react";
import InvoiceForm from "./components/Compose";
import {
  ActionIcon,
  Anchor,
  Button,
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
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useRestApi } from "../../../service/hook";
import Layout from "../../../components/Layout";
import { useQueryParams } from "../../../hooks/useQueryParams";
import dayjs from "dayjs";
import { useMediaQuery } from "@mantine/hooks";
import localizedFormat from "dayjs/plugin/localizedFormat";
import Link from "next/link";

dayjs.extend(localizedFormat);

const Invoices = () => {
  const [opened, { open, close }] = useDisclosure(false);
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
  };

  const handleSubmit = async (values) => {
    try {
      console.log(values);

      const { customer_tax, investment_total, from_date, to_date } = values;

      await post("/investments", {
        customer_tax,
        investment_total,
        from_date: dayjs(from_date).toISOString(),
        to_date: dayjs(to_date).toISOString(),
      });
      handleClose();
      get("/investments");
    } catch (e) {
      console.log(e);
    }
  };

  console.log(data);
  

  const rows = data?.map((v) => {
    return (
      <Table.Tr key={v._id}>
        <Table.Td>
          <Anchor
            component={Link}
            href={`/admin/invoices?customer=${v.customer_tax}`}
            underline="hover"
          >
            {v.customer_name}
          </Anchor>
        </Table.Td>
        <Table.Td>
          <NumberFormatter
            className="text-green-500 font-bold"
            value={v.investment_total}
            thousandSeparator
            decimalScale={2}
          />
        </Table.Td>
        <Table.Td>{dayjs(v.from_date).format("DD/MM/YYYY")}</Table.Td>
        <Table.Td>{dayjs(v.to_date).format("DD/MM/YYYY")}</Table.Td>
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
    get(`/investments?${params}`);
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

      <Table.ScrollContainer minWidth={680} h={500}>
        <Table
          withTableBorder
          stickyHeader
          highlightOnHover
          highlightOnHoverColor="#f0f9ff"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="w-[300px]">Tên khách hàng</Table.Th>
              <Table.Th className="w-[140px]">Tổng đầu tư</Table.Th>
              <Table.Th className="w-[120px]">Từ ngày</Table.Th>
              <Table.Th className="w-[120px]">Đến ngày</Table.Th>
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
            Tạo mới
          </Text>
        }
        fullScreen={!!isMobile}
        size="80%"
      >
        <InvoiceForm loading={loading} onSubmit={handleSubmit} />
      </Modal>
    </Layout>
  );
};
export default Invoices;
