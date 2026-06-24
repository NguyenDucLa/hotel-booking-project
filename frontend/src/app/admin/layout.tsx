"use client";
import React, { useEffect, useState } from 'react';
import { Layout, Menu, Typography, Avatar, Button, MenuProps, Space, Tag, Spin, Result, App } from 'antd';
import { 
  DashboardOutlined, 
  ShopOutlined, 
  TeamOutlined, 
  CalendarOutlined, 
  LogoutOutlined, 
  HomeOutlined,
  AppstoreAddOutlined,
  TagOutlined,
  CommentOutlined,
  TransactionOutlined,
  DatabaseOutlined,
  OrderedListOutlined
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { authService, AuthResponse } from '@/services/authService';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState<AuthResponse | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const user = await authService.getMe();
        // Cho phép cả ADMIN và HOTEL_OWNER vào khu vực quản trị
        if (user.role === 'ADMIN' || user.role === 'HOTEL_OWNER') {
          setAdminData(user);
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Auth error:", error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Route guard: nếu HOTEL_OWNER cố tình vào trang không được phép, đá về dashboard
  useEffect(() => {
    if (adminData && adminData.role === 'HOTEL_OWNER') {
      const blockedPaths = ['/admin/users', '/admin/transactions'];
      if (blockedPaths.includes(pathname)) {
        router.push('/admin');
      }
    }
  }, [adminData, pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Menu dành cho ADMIN: đầy đủ các mục
  const adminMenuItems: MenuProps['items'] = [
    { key: '/admin', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: '/admin/hotels', icon: <ShopOutlined />, label: 'Quản lý khách sạn' },
    { key: '/admin/room-types', icon: <DatabaseOutlined />, label: 'Quản lý loại phòng' },
    { key: '/admin/rooms', icon: <OrderedListOutlined />, label: 'Quản lý số phòng' },
    { key: '/admin/bookings', icon: <CalendarOutlined />, label: 'Quản lý đặt phòng' },
    { key: '/admin/amenities', icon: <AppstoreAddOutlined />, label: 'Quản lý Tiện ích' },
    { key: '/admin/promotions', icon: <TagOutlined />, label: 'Mã giảm giá' },
    { key: '/admin/reviews', icon: <CommentOutlined />, label: 'Đánh giá & Bình luận' },
    { key: '/admin/transactions', icon: <TransactionOutlined />, label: 'Lịch sử giao dịch' },
    { key: '/admin/users', icon: <TeamOutlined />, label: 'Người dùng' },
    { type: 'divider', style: { background: '#333' } },
    { key: '/', icon: <HomeOutlined />, label: 'Về trang chủ' },
  ];

  // Menu dành cho HOTEL_OWNER: chỉ các mục liên quan đến KS của họ
  const ownerMenuItems: MenuProps['items'] = [
    { key: '/admin', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: '/admin/hotels', icon: <ShopOutlined />, label: 'Khách sạn của tôi' },
    { key: '/admin/room-types', icon: <DatabaseOutlined />, label: 'Loại phòng' },
    { key: '/admin/rooms', icon: <OrderedListOutlined />, label: 'Số phòng' },
    { key: '/admin/bookings', icon: <CalendarOutlined />, label: 'Đơn hàng của tôi' },
    { key: '/admin/amenities', icon: <AppstoreAddOutlined />, label: 'Tiện ích' },
    { key: '/admin/promotions', icon: <TagOutlined />, label: 'Mã giảm giá' },
    { key: '/admin/reviews', icon: <CommentOutlined />, label: 'Đánh giá' },
    { type: 'divider', style: { background: '#333' } },
    { key: '/', icon: <HomeOutlined />, label: 'Về trang chủ' },
  ];

  const isOwner = adminData?.role === 'HOTEL_OWNER';
  const menuItems = isOwner ? ownerMenuItems : adminMenuItems;

  // Lấy chữ cái đầu của tên cho Avatar
  const avatarLetter = adminData?.fullName?.charAt(0)?.toUpperCase() || 'A';

  // Label hiển thị role
  const roleLabel = isOwner ? 'CHỦ KHÁCH SẠN' : 'QUẢN TRỊ VIÊN';
  const roleColor = isOwner ? '#52c41a' : '#faad14';

  // 1. Màn hình chờ khi đang kiểm tra quyền
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f9f7f2' }}>
        <Spin size="large" />
        <Text style={{ marginTop: 16, color: '#c5a059', fontWeight: 'bold' }}>Đang xác thực quyền quản trị...</Text>
      </div>
    );
  }

  // 2. Màn hình báo lỗi nếu không có quyền
  if (!isAuthorized) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fff' }}>
        <Result
          status="403"
          title={<span style={{ fontWeight: 900 }}>TRUY CẬP BỊ CHẶN</span>}
          subTitle="Xin lỗi, tài khoản của bạn không có quyền truy cập vào khu vực quản trị."
          extra={
            <Button 
                type="primary" 
                onClick={() => router.push('/')}
                style={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px', height: '40px' }}
            >
              Quay về trang chủ
            </Button>
          }
        />
      </div>
    );
  }

  // 3. Giao diện chính thức
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={260} theme="dark" style={{ background: '#1a1a1a', position: 'fixed', height: '100vh', left: 0 }}>
        <div style={{ padding: '32px 24px', textAlign: 'center', borderBottom: '1px solid #333' }}>
          <Title level={4} style={{ color: '#c5a059', margin: 0, fontWeight: 900, letterSpacing: '2px' }}>
            {isOwner ? 'OWNER PANEL' : 'ADMIN PANEL'}
          </Title>
        </div>
        
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[pathname]} 
          items={menuItems} 
          onClick={({ key }) => router.push(key.toString())}
          style={{ background: 'transparent', padding: '16px 0' }}
        />

        <div style={{ position: 'absolute', bottom: '24px', width: '100%', padding: '0 16px' }}>
          <Button 
            danger 
            block 
            type="text"
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ĐĂNG XUẤT
          </Button>
        </div>
      </Sider>

      <Layout style={{ marginLeft: 260 }}>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          boxShadow: '0 2px 8px #f0f1f2',
          height: '70px',
          lineHeight: 'normal',
          whiteSpace: 'nowrap'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: '200px' }}>
              <Title level={4} style={{ margin: 0, color: '#1a1a1a', fontWeight: 900, fontSize: '20px', whiteSpace: 'nowrap' }}>
                  {isOwner ? 'QUẢN LÝ KHÁCH SẠN' : 'HỆ THỐNG QUẢN TRỊ'}
              </Title>
              <Text style={{ color: '#c5a059', fontSize: '10px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  {isOwner ? 'DÀNH CHO CHỦ KHÁCH SẠN' : 'QUẢN LÝ KHÁCH SẠN v1.0'}
              </Text>
          </div>
          
          <Space size="middle" style={{ marginLeft: 'auto' }}>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                  <Text strong style={{ color: '#000', fontSize: '13px', lineHeight: 1 }}>{adminData?.fullName}</Text>
                  <Tag color={roleColor} style={{ fontSize: '9px', fontWeight: 'bold', marginTop: 2, alignSelf: 'flex-end' }}>
                    {roleLabel}
                  </Tag>
              </div>
              <Avatar size={40} style={{ backgroundColor: '#1a1a1a', color: roleColor, border: `2px solid ${roleColor}` }}>
                {avatarLetter}
              </Avatar>
          </Space>
        </Header>

        <Content style={{ 
          margin: '24px', 
          padding: '32px', 
          background: '#fff', 
          borderRadius: '20px',
          minHeight: 'calc(100vh - 128px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
          <App>{children}</App>
        </Content>
      </Layout>
    </Layout>
  );
}