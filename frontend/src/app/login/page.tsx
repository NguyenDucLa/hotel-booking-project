'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { authService } from '@/services/authService';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await authService.login(values);
      authService.setToken(response.token);
      message.success('Đăng nhập thành công!');
      window.location.href = '/';
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f7f2] p-4 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxYTFhMWEiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTM2IDM0djEwaDJ2LTEwaC0ybS0yLTRoMnYtMmgtMnYybS0yLTRoMnYtMmgtMnYybS0yLTRoMnYtMmgtMnYybS0yLTRoMnYtMmgtMnYybS0yLTRoMnYtMmgtMnYybS0yLTRoMnYtMmgtMnYyem0xMiAwdjEwaDJ2LTEwaC0ybS0yLTRoMnYtMmgtMnYybS0yLTRoMnYtMmgtMnYybS0yLTRoMnYtMmgtMnYybS0yLTRoMnYtMmgtMnYybS0yLTRoMnYtMmgtMnYyem0tMTIgMHYxMGgydi0xMGgtMnptLTItNGgydi0yaC0ydjJtLTItNGgydi0yaC0ydjJtLTItNGgydi0yaC0ydjJtLTItNGgydi0yaC0ydjJtLTItNGgydi0yaC0ydjJtLTItNGgydi0yaC0ydjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>

      <Card
        className="w-full max-w-md relative z-10 border border-gray-200 shadow-lg"
        style={{ backgroundColor: '#ffffff' }}
        title={
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Đăng Nhập
            </h1>
            <p className="text-gray-500 text-sm">Chào mừng trở lại</p>
          </div>
        }
      >
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            label={<span className="text-[#1a1a1a]">Email</span>}
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Nhập email của bạn"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-[#1a1a1a]">Mật khẩu</span>}
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu của bạn"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 text-white"
              style={{
                backgroundColor: '#1a1a1a',
                borderColor: '#1a1a1a',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#c5a059';
                e.currentTarget.style.borderColor = '#c5a059';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
                e.currentTarget.style.borderColor = '#1a1a1a';
              }}
            >
              Đăng Nhập
            </Button>
          </Form.Item>

          <div className="text-center">
            <span className="text-gray-500">Chưa có tài khoản? </span>
            <a href="/register" className="text-[#c5a059] hover:text-[#b8964f] font-medium">
              Đăng ký ngay
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
}
