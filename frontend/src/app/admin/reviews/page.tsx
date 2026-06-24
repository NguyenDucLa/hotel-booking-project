"use client";
import React from 'react';
import { Typography, Card, Rate } from 'antd';
import { CommentOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ReviewsPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <Title level={3} style={{ margin: 0, fontFamily: 'serif' }}>
          <CommentOutlined /> Đánh Giá & Bình Luận
        </Title>
      </div>

      <Card>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <CommentOutlined style={{ fontSize: 64, color: '#c5a059', marginBottom: 16 }} />
          <Title level={4} style={{ color: '#666' }}>Quản lý đánh giá từ khách hàng</Title>
          <Text type="secondary">
            Xem và phản hồi các đánh giá, nhận xét của khách hàng về khách sạn.
          </Text>
          <div style={{ marginTop: 16 }}>
            <Rate disabled defaultValue={4} style={{ fontSize: 20 }} />
          </div>
          <div style={{ marginTop: 8 }}>
            <Text type="secondary">Điểm đánh giá trung bình: 4.0 / 5</Text>
          </div>
        </div>
      </Card>
    </div>
  );
}
