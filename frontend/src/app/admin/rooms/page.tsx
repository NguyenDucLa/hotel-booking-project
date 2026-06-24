"use client";
import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Select, Typography, App, Card, Row, Col, Statistic, Tooltip } from 'antd';
import {
  PlusOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ToolOutlined,
  ClearOutlined,
  DesktopOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { adminService } from '@/services/adminService';

const { Title, Text } = Typography;

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  AVAILABLE: { color: 'green', label: 'Trống', icon: <CheckCircleOutlined /> },
  OCCUPIED: { color: 'red', label: 'Đang ở', icon: <StopOutlined /> },
  MAINTENANCE: { color: 'default', label: 'Đang sửa', icon: <ToolOutlined /> },
  CLEANING: { color: 'orange', label: 'Đang dọn', icon: <ClearOutlined /> },
};

export default function AdminRoomsPage() {
  const { message } = App.useApp();
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterHotel, setFilterHotel] = useState<number | null>(null);
  const [filterRoomType, setFilterRoomType] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsData, roomTypesData] = await Promise.all([
        adminService.getAllRooms(),
        adminService.getAllRoomTypes(),
      ]);
      setRooms(roomsData);
      setRoomTypes(roomTypesData);
    } catch (error) {
      message.error("Lỗi tải dữ liệu phòng");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (roomId: number, newStatus: string) => {
    try {
      await adminService.updateRoomStatus(roomId, newStatus);
      message.success("Đã cập nhật trạng thái phòng");
      fetchData();
    } catch (error) {
      message.error("Cập nhật thất bại");
    }
  };

  // Lọc danh sách hotels duy nhất từ roomTypes
  const hotels = React.useMemo(() => {
    const map = new Map<number, any>();
    roomTypes.forEach((rt: any) => {
      if (rt.hotel && !map.has(rt.hotel.id)) {
        map.set(rt.hotel.id, rt.hotel);
      }
    });
    return Array.from(map.values());
  }, [roomTypes]);

  // Lọc roomTypes theo hotel đã chọn
  const filteredRoomTypes = React.useMemo(() => {
    if (!filterHotel) return roomTypes;
    return roomTypes.filter((rt: any) => rt.hotel?.id === filterHotel);
  }, [filterHotel, roomTypes]);

  // Lọc rooms
  const filteredRooms = React.useMemo(() => {
    let result = rooms;
    if (filterHotel) {
      result = result.filter((r: any) => r.roomType?.hotel?.id === filterHotel);
    }
    if (filterRoomType) {
      result = result.filter((r: any) => r.roomType?.id === filterRoomType);
    }
    return result;
  }, [rooms, filterHotel, filterRoomType]);

  // Thống kê trạng thái
  const stats = React.useMemo(() => {
    const total = filteredRooms.length;
    const available = filteredRooms.filter((r: any) => r.status === 'AVAILABLE').length;
    const occupied = filteredRooms.filter((r: any) => r.status === 'OCCUPIED').length;
    const maintenance = filteredRooms.filter((r: any) => r.status === 'MAINTENANCE').length;
    return { total, available, occupied, maintenance };
  }, [filteredRooms]);

  const getStatusTag = (status: string) => {
    const cfg = STATUS_CONFIG[status] || { color: 'default', label: status, icon: null };
    return (
      <Tag color={cfg.color} className="font-bold border-none px-3 rounded-full">
        {cfg.icon} {cfg.label}
      </Tag>
    );
  };

  // Xác định tầng từ số phòng (VD: 101 → tầng 1)
  const getFloor = (roomNumber: string) => {
    if (!roomNumber || roomNumber.length < 2) return '?';
    return roomNumber.charAt(0);
  };

  const columns = [
    {
      title: 'PHÒNG',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      width: 100,
      render: (num: string) => (
        <Space>
          <DesktopOutlined className="text-[#c5a059]" />
          <Text strong style={{ fontSize: 16 }}>{num}</Text>
        </Space>
      ),
    },
    {
      title: 'TẦNG',
      key: 'floor',
      width: 80,
      render: (_: any, record: any) => (
        <Tag color="geekblue" className="font-bold border-none px-3 rounded-full">
          Tầng {getFloor(record.roomNumber)}
        </Tag>
      ),
    },
    {
      title: 'LOẠI PHÒNG',
      key: 'roomType',
      render: (_: any, record: any) => (
        <Text>{record.roomType?.name || '---'}</Text>
      ),
    },
    {
      title: 'KHÁCH SẠN',
      key: 'hotel',
      render: (_: any, record: any) => (
        <Text className="text-gray-500 text-sm">{record.roomType?.hotel?.name || '---'}</Text>
      ),
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      width: 260,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="Đánh dấu Trống">
            <Button
              size="small"
              type="text"
              icon={<CheckCircleOutlined />}
              className={record.status === 'AVAILABLE' ? 'text-green-500' : 'text-gray-300'}
              onClick={() => handleStatusChange(record.id, 'AVAILABLE')}
            />
          </Tooltip>
          <Tooltip title="Đánh dấu Đang ở">
            <Button
              size="small"
              type="text"
              icon={<StopOutlined />}
              className={record.status === 'OCCUPIED' ? 'text-red-500' : 'text-gray-300'}
              onClick={() => handleStatusChange(record.id, 'OCCUPIED')}
            />
          </Tooltip>
          <Tooltip title="Đánh dấu Đang sửa">
            <Button
              size="small"
              type="text"
              icon={<ToolOutlined />}
              className={record.status === 'MAINTENANCE' ? 'text-orange-500' : 'text-gray-300'}
              onClick={() => handleStatusChange(record.id, 'MAINTENANCE')}
            />
          </Tooltip>
          <Tooltip title="Đánh dấu Đang dọn dẹp">
            <Button
              size="small"
              type="text"
              icon={<ClearOutlined />}
              className={record.status === 'CLEANING' ? 'text-blue-500' : 'text-gray-300'}
              onClick={() => handleStatusChange(record.id, 'CLEANING')}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="!m-0 uppercase" style={{ fontFamily: 'serif' }}>
          <DesktopOutlined className="text-[#c5a059]" /> Quản Lý Phòng
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="!bg-[#1a1a1a] !text-[#c5a059] border-none font-bold h-10 px-6 rounded-lg hover:!bg-[#333]"
          onClick={() => message.info('Chức năng thêm phòng đang phát triển')}
        >
          THÊM PHÒNG
        </Button>
      </div>

      {/* Card thống kê */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6} lg={3}>
          <Card size="small" className="shadow-sm text-center">
            <Statistic title="Tổng" value={stats.total} styles={{ content: { fontSize: 20, color: '#1a1a1a' } }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card size="small" className="shadow-sm text-center" style={{ borderLeft: '3px solid #52c41a' }}>
            <Statistic title="Trống" value={stats.available} styles={{ content: { fontSize: 20, color: '#52c41a' } }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card size="small" className="shadow-sm text-center" style={{ borderLeft: '3px solid #ff4d4f' }}>
            <Statistic title="Đang ở" value={stats.occupied} styles={{ content: { fontSize: 20, color: '#ff4d4f' } }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card size="small" className="shadow-sm text-center" style={{ borderLeft: '3px solid #d9d9d9' }}>
            <Statistic title="Đang sửa" value={stats.maintenance} styles={{ content: { fontSize: 20, color: '#999' } }} />
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc */}
      <Card size="small" className="mb-6 shadow-sm">
        <Space wrap>
          <FilterOutlined className="text-[#c5a059]" />
          <Text strong className="text-xs uppercase tracking-wider">Bộ lọc:</Text>
          <Select
            allowClear
            placeholder="Tất cả khách sạn"
            style={{ width: 200 }}
            value={filterHotel}
            onChange={(val) => { setFilterHotel(val); setFilterRoomType(null); }}
            options={hotels.map((h: any) => ({ value: h.id, label: h.name }))}
          />
          <Select
            allowClear
            placeholder="Tất cả loại phòng"
            style={{ width: 200 }}
            value={filterRoomType}
            onChange={setFilterRoomType}
            options={filteredRoomTypes.map((rt: any) => ({ value: rt.id, label: rt.name }))}
          />
          <Button size="small" onClick={() => { setFilterHotel(null); setFilterRoomType(null); }}>
            Xóa lọc
          </Button>
        </Space>
      </Card>

      {/* Bảng danh sách phòng */}
      <Table
        columns={columns}
        dataSource={filteredRooms}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 12 }}
        className="shadow-sm rounded-xl overflow-hidden border border-gray-100"
      />
    </div>
  );
}
