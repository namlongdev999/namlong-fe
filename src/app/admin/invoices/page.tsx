"use client";
import React, { useEffect, useState } from "react";
import InvoiceForm from "./@Form";
import { useRouter } from "next/navigation";
import {
  Button,
  Combobox,
  Drawer,
  Flex,
  NumberFormatter,
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
import dayjs from "dayjs";
import { useMediaQuery } from "@mantine/hooks";
import Detail from "./@Detail";

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
        <Button size="xs" onClick={() => combobox.toggleDropdown()}>
          Xem
        </Button>
      </Combobox.Target>

      <Combobox.Dropdown className="!w-[80px]">
        <Combobox.Option onClick={onDetail} value="detail">
          Chi tiết
        </Combobox.Option>
        <Combobox.Option onClick={onEdit} value="edit">
          Sửa
        </Combobox.Option>
      </Combobox.Dropdown>
    </Combobox>
  );
};
const Invoices = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [logData, handleLogData] = useState({ type: "", data: undefined });
  const { data, get, post, loading } = useRestApi();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleClose = () => {
    close();
    handleLogData({ type: "", data: undefined });
  };

  const handleSubmit = async (values) => {
    try {
      await post("/invoices", {
        ...values,
        signed_date: dayjs(values.signed_date).toISOString(),
      });
      handleClose();
      get("/invoices");
    } catch (e) {
      console.log(e);
    }
  };

  const rows = data?.map((v) => {
    const expense = v.expenses?.reduce((t, r) => t + (r.expense ?? 0), 0);
    return (
      <Table.Tr key={v._id}>
        <Table.Td>{v.supplier_name}</Table.Td>
        <Table.Td>{v.customer_name}</Table.Td>
        <Table.Td>
          <NumberFormatter value={v.total} thousandSeparator decimalScale={2} />
        </Table.Td>
        <Table.Td>
          <NumberFormatter
            value={v.price_tax}
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
        <Table.Td>
          <NumberFormatter
            value={v.total - v.price_tax - expense - v.cash_back}
            thousandSeparator
            decimalScale={2}
          />
        </Table.Td>
        <Table.Td>
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

  useEffect(() => {
    get("/invoices");
  }, []);

  return (
    <Layout>
      <Flex direction="row" justify="space-between">
        <Title>Danh sách hóa đơn</Title>
        <Button leftSection={<IconPlus />} variant="outline" onClick={open}>
          Tạo mới hóa đơn
        </Button>
      </Flex>
      {/* <Space h="md" />
      <MonthPickerInput
        monthsListFormat="MM"
        valueFormat="MM/YYYY"
        placeholder="Chọn tháng"
      /> */}
      <Space h="md" />

      {/* <Group grow wrap="nowrap">
        <Card withBorder radius="md" padding="xl">
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            Tổng
          </Text>
          <Text fz="lg" fw={500}>
            10000000
          </Text>
        </Card>

        <Card withBorder radius="md" padding="xl">
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            Tổng còn lại
          </Text>
          <Text fz="lg" fw={500}>
            5000000
          </Text>
        </Card>
      </Group> */}

      <Table.ScrollContainer minWidth={1080} h={500}>
        <Table withTableBorder stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="w-[240px]">Tên cung cấp</Table.Th>
              <Table.Th className="w-[240px]">Tên khách hàng</Table.Th>
              <Table.Th className="w-[140px]">Tổng tiền</Table.Th>
              <Table.Th className="w-[140px]">Thuế</Table.Th>
              <Table.Th className="w-[140px]">Tổng chi phí</Table.Th>
              <Table.Th className="w-[140px]">Gửi lại</Table.Th>
              <Table.Th className="w-[140px]">Tổng còn lại</Table.Th>
              <Table.Th className="w-[100px]">Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Drawer
        opened={opened}
        onClose={handleClose}
        title={
          <Text c="blue" fw={700} size="lg">
            {logData.type === "detail" ? "Chi tiết nội dung" : "Tạo mới"}
          </Text>
        }
        position="right"
        size={isMobile ? "100%" : "75%"}
      >
        {logData.type === "detail" ? (
          <Detail data={logData.data} />
        ) : (
          <InvoiceForm loading={loading} onSubmit={handleSubmit} />
        )}
      </Drawer>
    </Layout>
  );
};
export default Invoices;
