"use client";
import React, { useEffect } from "react";
import {
  ActionIcon,
  Anchor,
  Button,
  Flex,
  LoadingOverlay,
  Modal,
  Space,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useMutation, useRestApi } from "../../../service/hook";
import Layout from "../../../components/Layout";
import Link from "next/link";
import InvoiceForm from "./components/Compose";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

const Invoices = () => {
  const { data: customerList, get, loading } = useRestApi();
  const { post, loading: loadingSubmit } = useMutation();
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleClose = () => {
    close();
  };

  const handleSubmit = async (values) => {
    try {
      const { tax_number, name, address } = values;

      await post("/customers", {
        tax_number,
        name,
        address,
      });
      handleClose();
      get("/customers");
    } catch (e) {
      console.log(e);
    }
  };

  const rows = customerList?.map((v) => {
    const expense = v.expenses?.reduce(
      (t, r) => t + (r.amount * r.price - r.amount * r.price * (r.tax / 100)),
      0
    );
    return (
      <Table.Tr key={v._id}>
        <Table.Td>
          <Anchor
            component={Link}
            href={`/admin/investments?customer=${v.tax_number}`}
            underline="hover"
          >
            {v.tax_number}
          </Anchor>
        </Table.Td>
        <Table.Td>{v.name}</Table.Td>
        <Table.Td>{v.address}</Table.Td>
      </Table.Tr>
    );
  });

  useEffect(() => {
    get("/customers");
  }, []);

  return (
    <Layout>
      <div className="relative">
        <LoadingOverlay visible={loading} />
        <Flex direction="row" justify="space-between" align="center">
          <Title order={2} className="text-blue-500">
            Danh sách khách hàng
          </Title>

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
              Tạo mới
            </Button>
          )}
        </Flex>
        <Space h="md" />

        <Table.ScrollContainer minWidth={740} h={500}>
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
                <Table.Th className="w-[300px]">Địa chỉ</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </div>
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
        <InvoiceForm loading={loadingSubmit} onSubmit={handleSubmit} />
      </Modal>
    </Layout>
  );
};
export default Invoices;
