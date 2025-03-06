"use client";

import { Text, Grid, NumberFormatter, Table } from "@mantine/core";
import dayjs from "dayjs";

export default function Detail({ data }) {
  const {
    supplier_tax,
    supplier_name,
    customer_tax,
    customer_name,
    total,
    price_tax,
    expenses,
    cash_back,
    signed_date,
    created_date,
  } = data;

  const expense = expenses?.reduce((t, r) => t + (r.expense ?? 0), 0);

  return (
    <Grid gutter="xs">
      <Grid.Col span={12}>
        <Text className="text-gray-600">Tên cung cấp:</Text>
        <Text fw={700}>{supplier_name}</Text>
      </Grid.Col>
      <Grid.Col span={12}>
        <Text className="text-gray-600">MST cung cấp:</Text>
        <Text fw={700}>{supplier_tax}</Text>
      </Grid.Col>

      <Grid.Col span={12}>
        <Text className="text-gray-600">Tên khách hàng:</Text>
        <Text fw={700}>{customer_name}</Text>
      </Grid.Col>
      <Grid.Col span={12}>
        <Text className="text-gray-600">MST khách hàng:</Text>
        <Text fw={700}>{customer_tax}</Text>
      </Grid.Col>
      <Grid.Col span={12}>
        <Text className="text-gray-600">Ngày ký:</Text>
        <Text fw={700}>{dayjs(signed_date).format("DD/MM/YYYY")}</Text>
      </Grid.Col>

      <Grid.Col span={6}>
        <Text className="text-gray-600">Tổng tiền:</Text>
        <Text fw={700}>
          <NumberFormatter value={total} thousandSeparator decimalScale={2} />{" "}
          VND
        </Text>
      </Grid.Col>
      <Grid.Col span={6}>
        <Text className="text-gray-600">Thuế:</Text>
        <Text fw={700}>
          <NumberFormatter
            value={price_tax}
            thousandSeparator
            decimalScale={2}
          />{" "}
          VND
        </Text>
      </Grid.Col>

      <Grid.Col span={6}>
        <Text className="text-gray-600">Tổng chi phí:</Text>
        <Text fw={700} className="font-medium text-green-600">
          <NumberFormatter value={expense} thousandSeparator decimalScale={2} />{" "}
          VND
        </Text>
      </Grid.Col>

      <Grid.Col span={6}>
        <Text className="text-gray-600">Gửi lại:</Text>
        <Text fw={700} className="font-medium text-green-600">
          <NumberFormatter
            value={cash_back}
            thousandSeparator
            decimalScale={2}
          />{" "}
          VND
        </Text>
      </Grid.Col>

      <Grid.Col span={12}>
        <Text className="text-gray-600">Danh sách chi phí</Text>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Tiêu đề</Table.Th>
              <Table.Th>Nội dung</Table.Th>
              <Table.Th>Tiền</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {expenses?.map((v, i) => (
              <Table.Tr key={i}>
                <Table.Td>{v.title}</Table.Td>
                <Table.Td>{v.desc}</Table.Td>
                <Table.Td>
                  <NumberFormatter
                    value={v.expense}
                    thousandSeparator
                    decimalScale={2}
                  />{" "}
                  VND
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Grid.Col>
      <Grid.Col span={12}>
        <Text className="text-gray-600">Tổng còn lại:</Text>
        <Text fw={700} className="font-medium text-green-600">
          <NumberFormatter
            value={total - price_tax - expense - cash_back}
            thousandSeparator
            decimalScale={2}
          />{" "}
          VND
        </Text>
      </Grid.Col>
    </Grid>
  );
}
