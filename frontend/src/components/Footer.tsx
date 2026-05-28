"use client";
import React from 'react';
import { FacebookFilled, InstagramOutlined, YoutubeFilled, TwitterOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10 px-10 border-t border-gray-900">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
        
        {/* Cột 1: Giới thiệu */}
        <div>
          <h2 className="text-2xl font-bold mb-6 tracking-tighter" style={{ fontFamily: 'serif' }}>
            LUXURY <span className="text-[#c5a059]">HOTEL</span>
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 font-light">
            Nơi kết nối đam mê du lịch và mang lại trải nghiệm nghỉ dưỡng 
            nhanh chóng, tiện lợi nhất cho cộng đồng yêu thích khám phá.
          </p>
          <div className="flex gap-6 text-xl text-gray-400">
            <FacebookFilled className="hover:text-[#c5a059] cursor-default" />
            <InstagramOutlined className="hover:text-[#c5a059] cursor-default" />
            <TwitterOutlined className="hover:text-[#c5a059] cursor-default" />
            <YoutubeFilled className="hover:text-[#c5a059] cursor-default" />
          </div>
        </div>

        {/* Cột 2: Liên kết (Chỉ hiển thị, không bấm được) */}
        <div>
          <h3 className="text-[#c5a059] text-xs font-black mb-8 uppercase tracking-[0.3em]">Liên kết</h3>
          <div className="flex flex-col gap-5 text-gray-500 text-sm font-light">
            <span className="cursor-default">Trang chủ</span>
            <span className="cursor-default">Danh sách khách sạn</span>
            <span className="cursor-default">Giới thiệu</span>
            <span className="cursor-default">Liên hệ</span>
          </div>
        </div>

        {/* Cột 3: Hỗ trợ (Chỉ hiển thị, không bấm được) */}
        <div>
          <h3 className="text-[#c5a059] text-xs font-black mb-8 uppercase tracking-[0.3em]">Hỗ trợ</h3>
          <div className="flex flex-col gap-5 text-gray-500 text-sm font-light">
            <span className="cursor-default">Điều khoản dịch vụ</span>
            <span className="cursor-default">Chính sách bảo mật</span>
            <span className="cursor-default">Câu hỏi thường gặp</span>
            <span className="cursor-default">Khiếu nại & Góp ý</span>
          </div>
        </div>

        {/* Cột 4: Liên hệ */}
        <div>
          <h3 className="text-[#c5a059] text-xs font-black mb-8 uppercase tracking-[0.3em]">Liên hệ</h3>
          <div className="flex flex-col gap-6 text-gray-500 text-sm font-light">
            <div className="flex items-start gap-4">
              <MailOutlined className="text-[#c5a059] mt-1" />
              <span>nguyenducla113@gmail.com</span>
            </div>
            <div className="flex items-start gap-4">
              <PhoneOutlined className="text-[#c5a059] mt-1" />
              <span>0866981044</span>
            </div>
            <div className="flex items-start gap-4">
              <EnvironmentOutlined className="text-[#c5a059] mt-1" />
              <span>TP. Hồ Chí Minh, Việt Nam</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-10 text-center">
        <p className="text-gray-600 text-[10px] tracking-[0.4em] uppercase font-bold">
          © 2026 LUXURY HOTEL PROJECT • DESIGN BY NGUYEN DUC LA
        </p>
      </div>
    </footer>
  );
}