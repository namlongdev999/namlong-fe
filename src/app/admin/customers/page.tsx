"use client";
import React, { useEffect } from "react";
import { Flex, LoadingOverlay, Space, Table, Title } from "@mantine/core";
import { useRestApi } from "../../../service/hook";
import Layout from "../../../components/Layout";

const Invoices = () => {
  const {
    data: customerList,
    get: getCutomerList,
    loading: loadingCustomerList,
  } = useRestApi();

  const rows = customerList?.map((v) => {
    const expense = v.expenses?.reduce(
      (t, r) => t + (r.amount * r.price - r.amount * r.price * (r.tax / 100)),
      0
    );
    return (
      <Table.Tr key={v._id}>
        <Table.Td>{v.tax_number}</Table.Td>
        <Table.Td>{v.name}</Table.Td>
        <Table.Td>{v.address}</Table.Td>
      </Table.Tr>
    );
  });

  useEffect(() => {
    getCutomerList("/customers");
  }, []);

  return (
    <Layout>
      <LoadingOverlay visible={loadingCustomerList} />
      <Flex direction="row" justify="space-between" align="center">
        <Title className="text-blue-500">Danh sách khách hàng</Title>
      </Flex>
      <Space h="md" />

      <Table.ScrollContainer minWidth={600} h={500}>
        <Table
          withTableBorder
          stickyHeader
          highlightOnHover
          highlightOnHoverColor="#f0f9ff"
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="w-[140px]">Mã số thuế</Table.Th>
              <Table.Th className="w-[300px]">Tên khách hàng</Table.Th>
              <Table.Th className="w-[140px]">Địa chỉ</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Layout>
  );
};
export default Invoices;
