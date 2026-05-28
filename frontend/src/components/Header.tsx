"use client";
import React, { useEffect, useState } from 'react';
import { Avatar, Space, Dropdown, MenuProps, message } from 'antd';
import { UserOutlined, DashboardOutlined, HistoryOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/authService';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await authService.getMe();
          setUser(data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    message.success("Đã đăng xuất");
    window.location.href = '/';
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'admin',
      label: (
        <div className="bg-[#1a1a1a] text-[#c5a059] font-bold p-2 rounded-t-md flex items-center gap-2 uppercase text-[10px] tracking-widest">
          <DashboardOutlined /> Trang Quản Trị
        </div>
      ),
      disabled: user?.role !== 'ADMIN',
      onClick: () => router.push('/admin')
    },
    { 
      key: 'profile', 
      icon: <UserOutlined />, 
      label: 'Dashboard cá nhân',
      onClick: () => router.push('/profile/dashboard') // Thêm lệnh này
    },
    { 
      key: 'history', 
      icon: <HistoryOutlined />, 
      label: 'Lịch sử đặt phòng',
      onClick: () => router.push('/profile/bookings') // ĐẢM BẢO DÒNG NÀY ĐÚNG ĐƯỜNG DẪN
    },
    { type: 'divider' },
    { 
      key: 'logout', 
      icon: <LogoutOutlined />, 
      label: <span className="text-red-500 font-bold">Đăng xuất</span>, 
      onClick: handleLogout 
    },
  ];

  return (
    <header className="bg-[#1a1a1a] text-white py-5 px-10 sticky top-0 z-50 shadow-2xl border-b border-[#c5a059]/10">
      <div className="container mx-auto flex items-center">
        
        {/* 1. GÓC BÊN TRÁI: TÊN TRANG WEB */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="no-underline">
            <h1 className="text-lg font-black tracking-[0.3em] m-0 uppercase" style={{ fontFamily: 'serif' }}>
              <span className="text-white">HOTEL</span>
              <span className="text-[#c5a059] ml-2">BOOKING</span>
            </h1>
          </Link>
        </div>

        {/* 2. CHÍNH GIỮA: MENU ĐIỀU HƯỚNG */}
        <nav className="flex items-center gap-10">
          <Link 
            href="/" 
            className={`text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${pathname === '/' ? 'text-[#c5a059]' : 'text-gray-400 hover:text-[#c5a059]'}`}
          >
            Trang Chủ
          </Link>
          <Link 
            href="/hotels" 
            className={`text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${pathname === '/hotels' ? 'text-[#c5a059]' : 'text-gray-400 hover:text-[#c5a059]'}`}
          >
            Danh Sách Khách Sạn
          </Link>
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500 cursor-default opacity-50">
            Liên Hệ
          </span>
        </nav>

        {/* 3. GÓC BÊN PHẢI: TÀI KHOẢN */}
        <div className="flex-1 flex justify-end">
          {user ? (
            <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
              <Space className="cursor-pointer group">
                <Avatar 
                  style={{ backgroundColor: '#c5a059' }} 
                  icon={<UserOutlined />} 
                  className="border border-white/10" 
                />
                <span className="text-[11px] font-bold tracking-widest text-gray-300 group-hover:text-[#c5a059] transition-all uppercase">
                  Hi, {user.fullName.split(' ').pop()}
                </span>
              </Space>
            </Dropdown>
          ) : (
            <Link 
              href="/login" 
              className="text-[11px] font-bold tracking-[0.2em] text-[#c5a059] border border-[#c5a059]/50 px-5 py-2 rounded-full hover:bg-[#c5a059] hover:text-black transition-all uppercase"
            >
              Đăng Nhập
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}