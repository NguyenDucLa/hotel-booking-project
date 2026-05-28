"use client"; // Bắt buộc phải có vì dùng usePathname để ẩn/hiện Header

import { Geist, Geist_Mono } from "next/font/google";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App } from 'antd'; // Thêm App ở đây
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Kiểm tra nếu là trang admin thì sẽ ẩn Header/Footer chung
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="vi" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased m-0 p-0`}
      >
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#c5a059', // Màu vàng Gold chủ đạo
                colorInfo: '#c5a059',
                colorBgContainer: '#ffffff',
                colorBorder: '#e8e8e8',
                colorTextBase: '#1a1a1a', // Chữ màu đen than
                borderRadius: 12, // Bo góc hiện đại hơn
                fontFamily: 'var(--font-geist-sans), serif',
              },
              components: {
                Button: {
                  controlHeight: 40,
                  fontWeight: 600,
                  borderRadius: 8,
                },
                Input: {
                  controlHeight: 40,
                  borderRadius: 8,
                },
                Card: {
                  borderRadiusLG: 16,
                }
              },
            }}
          >
            {/* 
              QUAN TRỌNG: Bọc toàn bộ ứng dụng trong thẻ <App> 
              để fix lỗi thông báo message/modal bị mất context
            */}
            <App>
              <div className="flex flex-col min-h-screen bg-[#f9f7f2]">
                {/* Chỉ hiện Header nếu KHÔNG PHẢI trang admin */}
                {!isAdminPage && <Header />}
                
                <main className="flex-grow">
                  {children}
                </main>

                {/* Chỉ hiện Footer nếu KHÔNG PHẢI trang admin */}
                {!isAdminPage && <Footer />}
              </div>
            </App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}