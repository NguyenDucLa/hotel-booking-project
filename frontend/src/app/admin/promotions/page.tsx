"use client";
import React from 'react';
import { Typography, Card, Button } from 'antd';
import { TagOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function PromotionsPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <Title level={3} style={{ margin: 0, fontFamily: 'serif' }}>
          <TagOutlined /> Mã Giảm Giá
        </Title>
      </div>

      <Card>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <TagOutlined style={{ fontSize: 64, color: '#c5a059', marginBottom: 16 }} />
          <Title level={4} style={{ color: '#666' }}>Quản lý mã giảm giá / khuyến mãi</Title>
          <Text type="secondary">
            Tạo các chương trình khuyến mãi, mã giảm giá theo % hoặc số tiền cố định 
            để thu hút khách đặt phòng.
          </Text>
          <div style={{ marginTop: 24 }}>
            <Button type="primary" size="large" style={{ background: '#1a1a1a', border: 'none', borderRadius: 8 }}>
              + Tạo mã giảm giá
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
