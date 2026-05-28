"use client";
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, Spin, Button } from 'antd';
import { 
  CalendarOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  WalletOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { userService } from '@/services/userService';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function UserDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    userService.getDashboard()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center"><Spin size="large" /></div>;

  return (
    <div className="min-h-screen bg-[#f9f7f2] py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10">
          <Title level={2} style={{ fontFamily: 'serif' }} className="!m-0 text-[#1a1a1a]">Dashboard Cá Nhân</Title>
          <Text className="text-gray-400">Chào mừng bạn trở lại, đây là tóm tắt hoạt động của bạn.</Text>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card variant="borderless" className="rounded-2xl shadow-sm">
              <Statistic 
                title="Tổng Booking" 
                value={stats?.totalBookings} 
                prefix={<CalendarOutlined className="text-[#c5a059]" />} 
                styles={{ content: { color: '#1a1a1a', fontWeight: 'bold' } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card variant="borderless" className="rounded-2xl shadow-sm">
              <Statistic 
                title="Đã Xác Nhận" 
                value={stats?.confirmedBookings} 
                prefix={<CheckCircleOutlined className="text-green-500" />} 
                styles={{ content: { color: '#1a1a1a', fontWeight: 'bold' } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card variant="borderless" className="rounded-2xl shadow-sm">
              <Statistic 
                title="Đang Chờ" 
                value={stats?.pendingBookings} 
                prefix={<ClockCircleOutlined className="text-orange-500" />} 
                styles={{ content: { color: '#1a1a1a', fontWeight: 'bold' } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card variant="borderless" className="rounded-2xl shadow-sm bg-[#1a1a1a]">
              <Statistic 
                title={<span className="text-gray-400">Tổng Chi Tiêu</span>} 
                value={stats?.totalSpent} 
                formatter={(val) => new Intl.NumberFormat('vi-VN').format(Number(val)) + 'đ'}
                prefix={<WalletOutlined className="text-[#c5a059]" />} 
                styles={{ content: { color: '#c5a059', fontWeight: 'bold' } }}
              />
            </Card>
          </Col>
        </Row>

        <div className="mt-12">
          <Card variant="borderless" className="rounded-3xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-8">
              <Title level={4} className="!m-0" style={{ fontFamily: 'serif' }}>Thao tác nhanh</Title>
            </div>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div className="p-6 border border-gray-100 rounded-2xl hover:border-[#c5a059] transition-all group cursor-pointer" 
                     onClick={() => router.push('/profile/bookings')}>
                  <Flex justify="space-between" align="center">
                    <div>
                      <Title level={5} className="!m-0">Lịch sử đặt phòng</Title>
                      <Text type="secondary" className="text-xs">Xem chi tiết các phòng bạn đã đặt</Text>
                    </div>
                    <ArrowRightOutlined className="text-gray-300 group-hover:text-[#c5a059]" />
                  </Flex>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="p-6 border border-gray-100 rounded-2xl hover:border-[#c5a059] transition-all group cursor-pointer"
                     onClick={() => router.push('/hotels')}>
                  <Flex justify="space-between" align="center">
                    <div>
                      <Title level={5} className="!m-0">Tiếp tục khám phá</Title>
                      <Text type="secondary" className="text-xs">Tìm kiếm thêm những chỗ nghỉ tuyệt vời</Text>
                    </div>
                    <ArrowRightOutlined className="text-gray-300 group-hover:text-[#c5a059]" />
                  </Flex>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Flex } from 'antd';