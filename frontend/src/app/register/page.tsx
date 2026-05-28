'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { authService } from '@/services/authService';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const response = await authService.register(values);
      authService.setToken(response.token);
      message.success('Đăng ký thành công!');
      window.location.href = '/login';
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Đăng ký thất bại');
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
              Đăng Ký
            </h1>
            <p className="text-gray-500 text-sm">Tạo tài khoản mới</p>
          </div>
        }
      >
        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            label={<span className="text-[#1a1a1a]">Họ tên</span>}
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Nhập họ tên của bạn"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-[#1a1a1a]">Email</span>}
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Nhập email của bạn"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-[#1a1a1a]">Số điện thoại</span>}
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="text-gray-400" />}
              placeholder="Nhập số điện thoại của bạn"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-[#1a1a1a]">Mật khẩu</span>}
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
            ]}
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
              Đăng Ký
            </Button>
          </Form.Item>

          <div className="text-center">
            <span className="text-gray-500">Đã có tài khoản? </span>
            <a href="/login" className="text-[#c5a059] hover:text-[#b8964f] font-medium">
              Đăng nhập ngay
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
}
