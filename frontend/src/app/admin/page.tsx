"use client";
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Spin, Typography } from 'antd';
import { ShopOutlined, TeamOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import { adminService } from '@/services/adminService';

const { Title } = Typography;

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" /></div>;

  return (
    <div>
      <Title level={3} style={{ marginBottom: '32px', fontFamily: 'serif' }}>TỔNG QUAN HỆ THỐNG</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ background: '#e6f7ff' }}>
            <Statistic title="Tổng Khách Sạn" value={stats?.totalHotels} prefix={<ShopOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ background: '#f6ffed' }}>
            <Statistic title="Người Dùng" value={stats?.totalUsers} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ background: '#fff7e6' }}>
            <Statistic title="Đơn Đặt Phòng" value={stats?.totalBookings} prefix={<CalendarOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ background: '#fff1f0', borderLeft: '4px solid #ff4d4f' }}>
            <Statistic 
              title="Tổng Doanh Thu" 
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