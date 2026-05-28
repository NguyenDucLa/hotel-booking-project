"use client";
import React, { useEffect, useState } from 'react';
import { Layout, Menu, Typography, Avatar, Button, MenuProps, Space, Tag, Spin, Result } from 'antd';
import { 
  DashboardOutlined, 
  ShopOutlined, 
  TeamOutlined, 
  CalendarOutlined, 
  LogoutOutlined, 
  HomeOutlined 
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/authService';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState<any>(null);
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
        // Kiểm tra nếu quyền là ADMIN mới cho vào
        if (user.role === 'ADMIN') {
          setAdminData(user);
          setIsAuthorized(true);
        } else {
          // Nếu là khách thường, chặn quyền truy cập
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const menuItems: MenuProps['items'] = [
    { key: '/admin', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: '/admin/hotels', icon: <ShopOutlined />, label: 'Quản lý khách sạn' },
    { key: '/admin/bookings', icon: <CalendarOutlined />, label: 'Quản lý đặt phòng' },
    { key: '/admin/users', icon: <TeamOutlined />, label: 'Người dùng' },
    { type: 'divider', style: { background: '#333' } },
    { key: '/', icon: <HomeOutlined />, label: 'Về trang chủ' },
  ];

  // 1. Màn hình chờ khi đang kiểm tra quyền
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f9f7f2' }}>
        <Spin size="large" />
        <Text style={{ marginTop: 16, color: '#c5a059', fontWeight: 'bold' }}>Đang xác thực quyền quản trị...</Text>
      </div>
    );
  }

  // 2. Màn hình báo lỗi nếu không phải là Admin
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

  // 3. Giao diện chính thức dành cho Admin
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={260} theme="dark" style={{ background: '#1a1a1a', position: 'fixed', height: '100vh', left: 0 }}>
        <div style={{ padding: '32px 24px', textAlign: 'center', borderBottom: '1px solid #333' }}>
          <Title level={4} style={{ color: '#c5a059', margin: 0, fontWeight: 900, letterSpacing: '2px' }}>
            ADMIN PANEL
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
            padding: '0 32px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            height: '80px',
            lineHeight: 'normal'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Title level={4} style={{ margin: 0, color: '#1a1a1a', fontWeight: 900, fontSize: '20px' }}>
                    HỆ THỐNG QUẢN TRỊ
                </Title>
                <Text style={{ color: '#c5a059', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    QUẢN LÝ KHÁCH SẠN v1.0
                </Text>
            </div>
            
            <Space size="large">
                <div style={{ textAlign: 'right' }}>
                    <Text strong style={{ color: '#000', display: 'block', fontSize: '14px' }}>
                        {adminData?.fullName}
                    </Text>
                    <Tag color="#c5a059" style={{ border: 'none', fontSize: '10px', margin: 0, fontWeight: 'bold' }}>
                        QUẢN TRỊ VIÊN
                    </Tag>
                </div>
                <Avatar 
                    size={48} 
                    style={{ backgroundColor: '#1a1a1a', color: '#c5a059', fontWeight: 'bold', border: '2px solid #c5a059' }}
                >
                    {adminData?.fullName?.charAt(0).toUpperCase()}
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
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}