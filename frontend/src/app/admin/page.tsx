"use client";
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Spin, Typography } from 'antd';
import { ShopOutlined, TeamOutlined, CalendarOutlined, DollarOutlined, CrownOutlined } from '@ant-design/icons';
import { adminService } from '@/services/adminService';
import { authService, AuthResponse } from '@/services/authService';

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<AuthResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await authService.getMe();
        setCurrentUser(user);
        const data = await adminService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" /></div>;

  const isOwner = currentUser?.role === 'HOTEL_OWNER';

  return (
    <div>
      <Title level={3} style={{ marginBottom: '8px', fontFamily: 'serif' }}>
        {isOwner ? 'TỔNG QUAN KHÁCH SẠN CỦA TÔI' : 'TỔNG QUAN HỆ THỐNG'}
      </Title>
      {isOwner && (
        <Text type="secondary" style={{ display: 'block', marginBottom: '32px', fontStyle: 'italic' }}>
          <CrownOutlined style={{ color: '#c5a059', marginRight: 6 }} />
          Chào mừng {currentUser?.fullName}, đây là số liệu thống kê của riêng bạn.
        </Text>
      )}
      
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ background: '#e6f7ff' }}>
            <Statistic 
              title={isOwner ? 'Khách Sạn Của Tôi' : 'Tổng Khách Sạn'} 
              value={stats?.totalHotels} 
              prefix={<ShopOutlined />} 
            />
          </Card>
        </Col>

        {/* Chỉ ADMIN mới thấy được tổng số người dùng */}
        {!isOwner && (
          <Col xs={24} sm={12} lg={6}>
            <Card variant="borderless" style={{ background: '#f6ffed' }}>
              <Statistic title="Người Dùng" value={stats?.totalUsers} prefix={<TeamOutlined />} />
            </Card>
          </Col>
        )}

        <Col xs={24} sm={12} lg={isOwner ? 12 : 6}>
          <Card variant="borderless" style={{ background: '#fff7e6' }}>
            <Statistic 
              title={isOwner ? 'Đơn Đặt Phòng Của Tôi' : 'Đơn Đặt Phòng'} 
              value={stats?.totalBookings} 
              prefix={<CalendarOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={isOwner ? 12 : 6}>
          <Card variant="borderless" style={{ background: '#fff1f0', borderLeft: '4px solid #ff4d4f' }}>
            <Statistic 
              title={isOwner ? 'Doanh Thu Của Tôi' : 'Tổng Doanh Thu'} 
              value={stats?.totalRevenue} 
              prefix={<DollarOutlined />}
              formatter={(val) => new Intl.NumberFormat('vi-VN').format(Number(val)) + 'đ'}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}