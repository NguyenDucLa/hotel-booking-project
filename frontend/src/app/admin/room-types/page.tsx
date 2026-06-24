"use client";
import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, Typography, App, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, AppstoreAddOutlined, BankOutlined } from '@ant-design/icons';
import { adminService } from '@/services/adminService';

const { Title, Text } = Typography;

export default function AdminRoomTypesPage() {
  const { message } = App.useApp();
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomTypesData, hotelsData] = await Promise.all([
        adminService.getAllRoomTypes(),
        adminService.getAllHotels(),
      ]);
      setRoomTypes(roomTypesData);
      setHotels(hotelsData);
    } catch (error) {
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        name: values.name,
        basePrice: values.basePrice,
        totalRooms: values.totalRooms,
        capacity: values.capacity,
        description: values.description || '',
        breakfastIncluded: values.breakfastIncluded || false,
        refundPolicy: values.refundPolicy || '',
        hotel: { id: values.hotelId },
      };

      if (editingItem) {
        await adminService.updateRoomType(editingItem.id, payload);
        message.success("Cập nhật loại phòng thành công");
      } else {
        await adminService.createRoomType(payload);
        message.success("Thêm loại phòng thành công");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      message.error(error.response?.data || "Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminService.deleteRoomType(id);
      await fetchData();
      message.success("Đã xóa loại phòng thành công");
    } catch (error: any) {
      message.error(error.response?.data || "Không thể xóa loại phòng này");
    }
  };

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('vi-VN').format(val) + 'đ';

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'TÊN LOẠI PHÒNG',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'KHÁCH SẠN',
      key: 'hotel',
      render: (_: any, record: any) => (
        <Space>
          <BankOutlined style={{ color: '#c5a059' }} />
          <Text>{record.hotel?.name || '---'}</Text>
        </Space>
      ),
    },
    {
      title: 'GIÁ / ĐÊM',
      dataIndex: 'basePrice',
      key: 'basePrice',
      render: (price: number) => (
        <Text strong style={{ color: '#c5a059' }}>{formatPrice(price)}</Text>
      ),
    },
    {
      title: 'SỨC CHỨA',
      dataIndex: 'capacity',
      key: 'capacity',
      render: (cap: number) => (
        <Tag color="purple">{cap} người</Tag>
      ),
    },
    {
      title: 'SỐ PHÒNG',
      dataIndex: 'totalRooms',
      key: 'totalRooms',
      render: (total: number) => (
        <Tag color="blue">{total} phòng</Tag>
      ),
    },
    {
      title: 'BỮA SÁNG',
      dataIndex: 'breakfastIncluded',
      key: 'breakfastIncluded',
      render: (val: boolean) => (
        <Tag color={val ? 'green' : 'default'}>{val ? 'Có' : 'Không'}</Tag>
      ),
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      width: 140,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#1890ff' }} />}
            onClick={() => {
              setEditingItem(record);
              form.setFieldsValue({
                name: record.name,
                basePrice: record.basePrice,
                totalRooms: record.totalRooms,
                capacity: record.capacity,
                description: record.description,
                breakfastIncluded: record.breakfastIncluded,
                refundPolicy: record.refundPolicy,
                hotelId: record.hotel?.id,
              });
              setIsModalOpen(true);
            }}
          />
          <Popconfirm
            title="Xác nhận xóa loại phòng này?"
            description="Hành động này không thể hoàn tác!"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, fontFamily: 'serif', textTransform: 'uppercase' }}>
          <AppstoreAddOutlined style={{ color: '#c5a059', marginRight: 8 }} />
          Quản Lý Loại Phòng
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingItem(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
          style={{ backgroundColor: '#1a1a1a', borderColor: '#1a1a1a', fontWeight: 'bold', height: 40, borderRadius: 8 }}
        >
          THÊM LOẠI PHÒNG
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={roomTypes}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
        bordered
      />

      <Modal
        title={
          <span style={{ fontFamily: 'serif', fontWeight: 900 }}>
            {editingItem ? 'SỬA LOẠI PHÒNG' : 'THÊM LOẠI PHÒNG MỚI'}
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingItem ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        okButtonProps={{ style: { backgroundColor: '#c5a059', borderColor: '#c5a059', color: '#000', fontWeight: 'bold' } }}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 24 }}>
          <Form.Item name="name" label="Tên loại phòng" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input placeholder="VD: Standard, Deluxe, Suite..." />
          </Form.Item>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="basePrice" label="Giá / đêm (VNĐ)" rules={[{ required: true }]} style={{ width: '100%' }}>
              <InputNumber min={0} className="w-full" placeholder="500000" formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>
            <Form.Item name="capacity" label="Sức chứa (người)" rules={[{ required: true }]} style={{ width: '100%' }}>
              <InputNumber min={1} max={20} className="w-full" placeholder="2" />
            </Form.Item>
          </Space>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="totalRooms" label="Số lượng phòng" rules={[{ required: true }]} style={{ width: '100%' }}>
              <InputNumber min={1} max={999} className="w-full" placeholder="10" />
            </Form.Item>
            <Form.Item name="breakfastIncluded" label="Bao gồm bữa sáng" style={{ width: '100%' }}>
              <Select>
                <Select.Option value={true as any}>Có</Select.Option>
                <Select.Option value={false as any}>Không</Select.Option>
              </Select>
            </Form.Item>
          </Space>

          <Form.Item name="hotelId" label="Thuộc khách sạn" rules={[{ required: true, message: 'Chọn khách sạn' }]}>
            <Select placeholder="Chọn khách sạn..." showSearch optionFilterProp="children">
              {hotels.map((h: any) => (
                <Select.Option key={h.id} value={h.id}>
                  {h.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Mô tả / Loại giường">
            <Input.TextArea rows={3} placeholder="VD: 1 giường King, 40m², có ban công..." />
          </Form.Item>

          <Form.Item name="refundPolicy" label="Chính sách hoàn hủy">
            <Input.TextArea rows={2} placeholder="VD: Miễn phí hủy trước 24h" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
