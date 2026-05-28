"use client";
import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, message, Popconfirm, Typography, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ShopOutlined } from '@ant-design/icons';
import { adminService } from '@/services/adminService';

const { Title } = Typography;

export default function AdminHotelsPage() {
  const { message } = App.useApp();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<any>(null);
  const [form] = Form.useForm();
  
  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllHotels();
      setHotels(data);
    } catch (error) {
      message.error("Lỗi tải danh sách khách sạn");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingHotel) {
        await adminService.updateHotel(editingHotel.id, values);
        message.success("Cập nhật thành công");
      } else {
        await adminService.addHotel(values);
        message.success("Thêm khách sạn thành công");
      }
      setIsModalOpen(false);
      fetchHotels();
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminService.deleteHotel(id);
      message.success("Đã xóa khách sạn");
      fetchHotels();
    } catch (error) {
      message.error("Không thể xóa khách sạn này");
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Tên Khách Sạn', dataIndex: 'name', key: 'name', render: (text: string) => <b>{text}</b> },
    { title: 'Thành Phố', dataIndex: 'city', key: 'city', render: (city: string) => <Tag color="blue">{city}</Tag> },
    { title: 'Địa Chỉ', dataIndex: 'address', key: 'address', ellipsis: true },
    { title: 'Hạng Sao', dataIndex: 'starRating', key: 'starRating', render: (stars: number) => <Tag color="gold">{stars} ⭐</Tag> },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined className="text-blue-500" />} 
            onClick={() => {
              setEditingHotel(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          />
          <Popconfirm title="Xác nhận xóa khách sạn này?" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" icon={<DeleteOutlined className="text-red-500" />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <Title level={3} className="!m-0 uppercase" style={{ fontFamily: 'serif' }}>
          <ShopOutlined /> Quản Lý Khách Sạn
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setEditingHotel(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
          className="!bg-[#1a1a1a] !text-[#c5a059] border-none font-bold h-10 px-6 rounded-lg"
        >
          THÊM KHÁCH SẠN
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={hotels} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 7 }}
        className="shadow-sm rounded-xl overflow-hidden border border-gray-100"
      />

      <Modal
        title={editingHotel ? "SỬA THÔNG TIN" : "THÊM KHÁCH SẠN MỚI"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingHotel ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        okButtonProps={{ className: "!bg-[#c5a059] border-none" }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-6">
          <Form.Item name="name" label="Tên khách sạn" rules={[{ required: true }]}>
            <Input placeholder="Nhập tên khách sạn" />
          </Form.Item>
          <Form.Item name="city" label="Thành phố" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: Hà Nội, Đà Nẵng..." />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
            <Input placeholder="Số đường, Phường/Quận..." />
          </Form.Item>
          <Form.Item name="starRating" label="Hạng sao" rules={[{ required: true }]}>
            <InputNumber min={1} max={5} className="w-full" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả ngắn gọn về khách sạn" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}