"use client";
import React from 'react';
import { Typography, Card, Button } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function AmenitiesPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <Title level={3} style={{ margin: 0, fontFamily: 'serif' }}>
          <AppstoreAddOutlined /> Quản Lý Tiện Ích
        </Title>
      </div>

      <Card>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <AppstoreAddOutlined style={{ fontSize: 64, color: '#c5a059', marginBottom: 16 }} />
          <Title level={4} style={{ color: '#666' }}>Quản lý tiện ích khách sạn</Title>
          <Text type="secondary">
            Trang này cho phép bạn thêm, sửa, xóa các tiện ích (Wifi, Hồ bơi, Gym, ...) 
            để gắn vào khách sạn.
          </Text>
          <div style={{ marginTop: 24 }}>
            <Button type="primary" size="large" style={{ background: '#1a1a1a', border: 'none', borderRadius: 8 }}>
              + Thêm tiện ích mới
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
