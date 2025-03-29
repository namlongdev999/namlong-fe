import { Container, Text, Divider, Grid, Space } from "@mantine/core";
import { IconMail, IconPhone } from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer className="bg-[#153e6d] text-white py-6 border-t border-gray-300">
      <Container size="xl">
        {/* Grid Layout */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <div>
              <Text className="text-lg font-bold mb-3">Địa chỉ văn phòng</Text>
              <Text className="text-gray-400">
                <strong>TRỤ SỞ CHÍNH</strong>
                <br />
                156/8 Lê Đình Cẩn, Phường Tân Tạo, Quận Bình Tân, TP Hồ Chí
                Minh, Việt Nam
              </Text>
            </div>
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <div>
              <Text className="text-lg font-bold mb-3">Địa chỉ Email</Text>
              <div className="flex items-center gap-2 text-gray-400">
                <IconMail size={20} />
              </div>

              <Text className="text-lg font-bold mt-4 mb-3">
                Liên hệ với chúng tôi qua
              </Text>
              <div className="flex items-center gap-2 text-gray-400">
                <IconPhone size={20} /> Hotline: 0902963539
              </div>
            </div>
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <div>
              <Text className="text-lg font-bold mb-3">Thời gian làm việc</Text>
              <Text className="text-gray-400">
                <strong>Sáng:</strong> 08:00 - 12:00 <br />
                (Thứ Hai - Thứ Bảy)
              </Text>
              <Text className="text-gray-400 mt-2">
                <strong>Chiều:</strong> 13:30 - 17:30 <br />
                (Thứ Hai - Thứ Sáu)
              </Text>
            </div>
          </Grid.Col>
        </Grid>
      </Container>
      <Space h="lg" />
      <Text className="text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} NamLong. All rights reserved.
      </Text>
    </footer>
  );
};

export default Footer;
