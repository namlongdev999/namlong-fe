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
    tax,
    expenses,
    cash_back,
    signed_date,
    created_date,
  } = data;

  // const expense = expenses?.reduce((t, r) => t + (r.expense ?? 0), 0);
  const expense = expenses?.reduce((t, r) => t + r.amount * r.price, 0);

  return (
    <Grid gutter="xs">
      {/* <Grid.Col span={12}>
        <Text className="text-gray-600">Tên cung cấp:</Text>
        <Text fw={700}>{supplier_name}</Text>
      </Grid.Col>
      <Grid.Col span={12}>
        <Text className="text-gray-600">MST cung cấp:</Text>
        <Text fw={700}>{supplier_tax}</Text>
      </Grid.Col> */}

      <Grid.Col span={12}>
        <Text className="text-gray-600">Tên khách hàng:</Text>
        <Text fw={700}>{customer_name}</Text>
      </Grid.Col>
      {/* <Grid.Col span={12}>
        <Text className="text-gray-600">MST khách hàng:</Text>
        <Text fw={700}>{customer_tax}</Text>
      </Grid.Col> */}
      <Grid.Col span={12}>
        <Text className="text-gray-600">Ngày ký:</Text>
        <Text fw={700}>{dayjs(signed_date).format("DD/MM/YYYY")}</Text>
      </Grid.Col>

      <Grid.Col span={6}>
        <Text className="text-gray-600">Tổng tiền:</Text>
        <Text fw={700} className="!text-red-500">
          <NumberFormatter value={total} thousandSeparator decimalScale={2} />{" "}
          VND
        </Text>
      </Grid.Col>
      <Grid.Col span={6}>
        <Text className="text-gray-600">Tiền thuế:</Text>
        <Text fw={700}>
          <NumberFormatter
            value={(total * tax) / 100}
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
        <Text className="text-gray-600">Tiền gửi lại:</Text>
        <Text fw={700} className="font-medium text-green-600">
          <NumberFormatter
            value={(total * cash_back) / 100}
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
              <Table.Th>Tên nhân viên</Table.Th>
              <Table.Th>Số tiết</Table.Th>
              <Table.Th>Lương theo tiết</Table.Th>
              <Table.Th>Tổng lương</Table.Th>
              <Table.Th>Thuế TNCN</Table.Th>
              <Table.Th>Tổng lương nhận</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {expenses?.map((v, i) => (
              <Table.Tr key={i}>
                <Table.Td>{v.title}</Table.Td>
                <Table.Td>
                  <NumberFormatter
                    value={v.amount}
                    thousandSeparator
                    decimalScale={2}
                  />
                </Table.Td>
                <Table.Td>
                  <NumberFormatter
                    value={v.price}
                    thousandSeparator
                    decimalScale={2}
                  />{" "}
                  VND
                </Table.Td>
                <Table.Td>
                  <NumberFormatter
                    value={v.amount * v.price}
                    thousandSeparator
                    decimalScale={2}
                  />{" "}
                  VND
                </Table.Td>
                <Table.Td>
                  <NumberFormatter
                    value={v.tax}
                    thousandSeparator
                    decimalScale={2}
                  />
                  %
                </Table.Td>
                <Table.Td>
                  <NumberFormatter
                    value={
                      v.amount * v.price - v.amount * v.price * (v.tax / 100)
                    }
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
      <Grid.Col className="text-right" span={12}>
        <Text className="text-gray-600">Tổng doanh thu:</Text>
        <Text fw={700} className="!text-xl !text-green-600">
          <NumberFormatter
            value={
              total - (total * tax) / 100 - expense - (total * cash_back) / 100
            }
            thousandSeparator
            decimalScale={2}
          />{" "}
          VND
        </Text>
      </Grid.Col>
    </Grid>
  );
}
