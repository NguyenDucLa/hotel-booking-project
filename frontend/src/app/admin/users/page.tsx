"use client";
import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Typography, App, Select, message, Avatar } from 'antd';
import { TeamOutlined, UserOutlined, CrownOutlined } from '@ant-design/icons';
import { adminService } from '@/services/adminService';

const { Title, Text } = Typography;

export default function AdminUsersPage() {
  const { message } = App.useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      message.error("Lỗi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      message.success("Cập nhật quyền thành công");
      fetchUsers();
    } catch (error) {
      message.error("Cập nhật quyền thất bại");
    }
  };

  const roleColors: Record<string, string> = {
    ADMIN: 'red',
    HOTEL_OWNER: 'green',
    CUSTOMER: 'blue',
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'HỌ TÊN',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name: string, record: any) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#c5a059' }} icon={<UserOutlined />} />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SỐ ĐIỆN THOẠI',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || <Text type="secondary">---</Text>,
    },
    {
      title: 'VAI TRÒ',
      dataIndex: ['role', 'name'],
      key: 'role',
      render: (roleName: string) => (
        <Tag color={roleColors[roleName] || 'default'} className="font-bold border-none px-3 rounded-full">
          {roleName === 'HOTEL_OWNER' && <CrownOutlined />}
          {roleName === 'ADMIN' && <CrownOutlined />}
          {roleName || 'CUSTOMER'}
        </Tag>
      ),
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'} className="font-bold border-none px-3 rounded-full">
          {active ? 'HOẠT ĐỘNG' : 'BỊ KHÓA'}
        </Tag>
      ),
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Select
            defaultValue={record.role?.name || 'CUSTOMER'}
            style={{ width: 140 }}
            onChange={(value) => handleRoleChange(record.id, value)}
            options={[
              { value: 'CUSTOMER', label: 'Khách hàng' },
              { value: 'HOTEL_OWNER', label: 'Chủ khách sạn' },
              { value: 'ADMIN', label: 'Quản trị viên' },
            ]}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <Title level={3} style={{ margin: 0, fontFamily: 'serif' }}>
          <TeamOutlined /> Quản Lý Người Dùng
        </Title>
        <Tag color="red" style={{ fontWeight: 'bold' }}>CHỈ DÀNH CHO ADMIN</Tag>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
        className="shadow-sm rounded-xl overflow-hidden border border-gray-100"
      />
    </div>
  );
}
