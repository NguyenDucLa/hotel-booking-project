"use client";
import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Card, Spin, message, Flex, Breadcrumb } from 'antd';
import { bookingService } from '@/services/bookingService';
import { CalendarOutlined, ShopOutlined, HistoryOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await bookingService.getMyBookings();
        // Sắp xếp đơn mới nhất lên đầu
        const sortedData = data.sort((a: any, b: any) => b.id - a.id);
        setBookings(sortedData);
      } catch (error) {
        console.error(error);
        message.error("Không thể tải lịch sử đặt phòng");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const columns = [
    {
      title: 'MÃ ĐƠN',
      dataIndex: 'id',
      key: 'id',
      render: (id: any) => <Text strong className="text-blue-600">#{id}</Text>,
    },
    {
      title: 'KHÁCH SẠN',
      dataIndex: 'hotel',
      key: 'hotel',
      render: (hotel: any) => (
        <Flex vertical gap={0}>
            <Text strong>{hotel?.name}</Text>
            <Text type="secondary" style={{ fontSize: '11px' }}>{hotel?.city}</Text>
        </Flex>
        ),
      
    },
    {
      title: 'CHI TIẾT PHÒNG',
      dataIndex: 'bookingDetails',
      key: 'details',
      render: (details: any[]) => (
        <div className="flex flex-wrap gap-1">
          {details?.map((d: any) => (
            <Tag key={d.id} color="default" className="border-gray-200">
              Phòng: {d.room?.roomNumber}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'THỜI GIAN',
      key: 'dates',
      render: (_: any, record: any) => (
        <Flex vertical gap={0}>
          <Text className="text-xs text-green-600">Từ: {record.checkInDate}</Text>
          <Text className="text-xs text-red-600">Đến: {record.checkOutDate}</Text>
        </Flex>
      ),
    },
    {
      title: 'TỔNG TIỀN',
      dataIndex: 'totalAmount',
      key: 'amount',
      render: (amount: any) => (
        <Text strong className="text-[#b89600]">
          {new Intl.NumberFormat('vi-VN').format(amount)}đ
        </Text>
      ),
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'gold';
        if (status === 'CONFIRMED' || status === 'PAID') color = 'green';
        if (status === 'CANCELLED') color = 'red';
        return (
          <Tag color={color} className="font-bold border-none px-3 py-1 rounded-full uppercase text-[10px]">
            {status}
          </Tag>
        );
      },
    },
  ];

  if (loading) return <div className="h-screen flex items-center justify-center"><Spin size="large" /></div>;

  return (
    <div className="min-h-screen bg-[#f9f7f2] py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        
        <Breadcrumb 
          className="mb-8 font-bold uppercase text-[10px] tracking-widest"
          items={[
            { title: <Link href="/">Trang chủ</Link> },
            { title: 'Lịch sử đặt phòng' }
          ]}
        />

        <Card variant="borderless" className="rounded-3xl shadow-sm overflow-hidden p-4">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-[#fd5c63] p-3 rounded-2xl">
              <HistoryOutlined className="text-2xl text-[#c5a059]" />
            </div>
            <div>
              <Title level={2} className="!m-0" style={{ fontFamily: 'serif' }}>Lịch Sử Đặt Phòng</Title>
              <Text className="text-gray-400">Xem và quản lý các đơn hàng bạn đã thực hiện</Text>
            </div>
          </div>

          <Table 
            dataSource={bookings} 
            columns={columns} 
            rowKey="id"
            pagination={{ pageSize: 8 }}
            className="custom-table"
          />
        </Card>
      </div>
    </div>
  );
}