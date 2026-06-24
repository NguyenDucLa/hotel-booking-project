"use client";
import React from 'react';
import { Typography, Card, Tag } from 'antd';
import { TransactionOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function TransactionsPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <Title level={3} style={{ margin: 0, fontFamily: 'serif' }}>
          <TransactionOutlined /> Lịch Sử Giao Dịch
        </Title>
        <Tag color="red" style={{ fontWeight: 'bold' }}>CHỈ DÀNH CHO ADMIN</Tag>
      </div>

      <Card>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <TransactionOutlined style={{ fontSize: 64, color: '#c5a059', marginBottom: 16 }} />
          <Title level={4} style={{ color: '#666' }}>Lịch sử giao dịch toàn hệ thống</Title>
          <Text type="secondary">
            Theo dõi tất cả các giao dịch thanh toán, hoàn tiền và đối soát 
            trên toàn bộ hệ thống.
          </Text>
        </div>
      </Card>
    </div>
  );
}
