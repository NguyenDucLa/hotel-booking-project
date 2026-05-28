"use client";
import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Typography, Card, Spin, App, Tooltip, Popconfirm, Modal, Form, DatePicker, Select } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, CalendarOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
import { adminService } from '@/services/adminService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function AdminBookingsPage() {
  const { message } = App.useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllBookings();
      setBookings(data);
    } catch (error) {
      message.error("Lỗi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      const payload = {
        ...values,
        checkInDate: values.dates[0].format('YYYY-MM-DD'),
        checkOutDate: values.dates[1].format('YYYY-MM-DD'),
      };
      await adminService.updateBookingStatus(editingBooking.id, values.status);
      // Bạn có thể mở rộng API updateBooking để sửa cả ngày tháng nếu muốn
      message.success("Cập nhật thành công");
      setIsModalOpen(false);
      fetchBookings();
    } catch (error) {
      message.error("Cập nhật thất bại");
    }
  };

  const columns = [
    {
      title: 'MÃ ĐƠN',
      dataIndex: 'id',
      key: 'id',
      render: (id: any) => <Text strong className="text-blue-600">#{id}</Text>,
    },
    {
      title: 'KHÁCH HÀNG',
      key: 'user',
      render: (_: any, record: any) => (
        <Space>
          <Avatar style={{ backgroundColor: '#c5a059' }} size="small" icon={<UserOutlined />} />
          <Text strong>{record.user?.fullName || "Khách vãng lai"}</Text>
        </Space>
      ),
    },
    {
      title: 'KHÁCH SẠN / PHÒNG',
      key: 'hotel_room',
      render: (_: any, record: any) => (
        <div>
          <Text className="block font-bold text-slate-700">{record.hotel?.name}</Text>
          {record.bookingDetails?.map((d: any) => (
            <Tag key={d.id} color="blue" className="mt-1">Phòng: {d.room?.roomNumber}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'THỜI GIAN',
      key: 'stay_time',
      render: (_: any, record: any) => (
        <div className="text-xs text-gray-500">
          <CalendarOutlined className="mr-1 text-[#c5a059]" />
          {dayjs(record.checkInDate).format('DD/MM')} - {dayjs(record.checkOutDate).format('DD/MM/YYYY')}
        </div>
      ),
    },
    {
      title: 'TỔNG TIỀN',
      dataIndex: 'totalAmount',
      key: 'amount',
      render: (amount: any) => <Text strong className="text-[#b89600]">{new Intl.NumberFormat('vi-VN').format(amount)}đ</Text>,
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'gold';
        if (status === 'CONFIRMED' || status === 'PAID') color = 'green';
        if (status === 'CANCELLED') color = 'red';
        return <Tag color={color} className="font-bold border-none px-3 rounded-full">{status}</Tag>;
      },
    },
    {
      title: 'THAO TÁC',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Sửa đơn hàng">
            <Button 
              type="text" 
              icon={<EditOutlined className="text-blue-500" />} 
              onClick={() => {
                setEditingBooking(record);
                form.setFieldsValue({
                  status: record.status,
                  dates: [dayjs(record.checkInDate), dayjs(record.checkOutDate)]
                });
                setIsModalOpen(true);
              }}
            />
          </Tooltip>
          {record.status !== 'CANCELLED' && (
            <Popconfirm title="Hủy đơn này?" onConfirm={() => adminService.updateBookingStatus(record.id, 'CANCELLED').then(fetchBookings)}>
              <Button type="text" icon={<CloseCircleOutlined className="text-red-500" />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} className="mb-8 uppercase tracking-widest" style={{ fontFamily: 'serif' }}>Quản Lý Đặt Phòng</Title>

      <Table 
        dataSource={bookings} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 8 }}
        className="shadow-sm rounded-2xl overflow-hidden border border-gray-100"
      />

      <Modal
        title="SỬA THÔNG TIN ĐƠN HÀNG"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu thay đổi"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate} className="mt-6">
          <Form.Item name="dates" label="Thời gian lưu trú">
            <DatePicker.RangePicker className="w-full" />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái đơn hàng">
            <Select>
              <Select.Option value="PENDING">PENDING (Chờ thanh toán)</Select.Option>
              <Select.Option value="CONFIRMED">CONFIRMED (Đã xác nhận)</Select.Option>
              <Select.Option value="PAID">PAID (Đã thanh toán)</Select.Option>
              <Select.Option value="CANCELLED">CANCELLED (Đã hủy)</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

import { Avatar } from 'antd';