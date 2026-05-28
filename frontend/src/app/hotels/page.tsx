"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { hotelService } from '@/services/hotelService';
import HotelCard from '@/components/HotelCard';
import { Breadcrumb, Spin, Row, Col, Typography, Card, Checkbox, Rate, Divider, Empty, Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

// Thành phần chứa nội dung chính
function HotelsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query'); // Nhận tham số 'query' từ URL
  
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data;
        if (query) {
          // Nếu có từ khóa tìm kiếm
          data = await hotelService.getHotelsByKeyword(query);
        } else {
          // Nếu không có từ khóa (vào trực tiếp trang danh sách)
          data = await hotelService.getAllHotels();
        }
        setHotels(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi lấy danh sách khách sạn:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query]); // Chạy lại mỗi khi từ khóa trên URL thay đổi

  if (loading) return (
    <div className="h-96 flex items-center justify-center bg-[#f9f7f2]">
      <Spin size="large" description="Đang tìm kiếm khách sạn hoàn hảo cho bạn..." />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9f7f2] py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <Breadcrumb 
          className="mb-8 uppercase text-[10px] tracking-[0.2em] font-bold"
          items={[
            { title: <Link href="/" className="text-gray-400 hover:text-[#c5a059]">Trang Chủ</Link> },
            { title: <span className="text-[#c5a059]">Danh Sách Khách Sạn</span> }
          ]}
        />

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Lọc (Trưng bày) */}
          <div className="w-full lg:w-1/4">
            <Card className="rounded-2xl border-none shadow-sm sticky top-28 p-2">
              <div className="flex items-center gap-2 mb-8 border-b pb-4">
                <FilterOutlined className="text-[#c5a059]" />
                <span className="font-bold text-xs uppercase tracking-widest text-[#1a1a1a]">Bộ lọc tìm kiếm</span>
              </div>
              <div className="mb-10">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-5">Hạng sao</h4>
                <div className="flex flex-col gap-4">
                  {[5, 4, 3].map(star => (
                    <div key={star} className="flex justify-between items-center opacity-50 cursor-not-allowed">
                      <div className="flex items-center gap-2">
                        <Rate disabled defaultValue={star} style={{ fontSize: 10 }} />
                        <span className="text-sm font-medium text-gray-600">{star} Sao</span>
                      </div>
                      <Checkbox disabled />
                    </div>
                  ))}
                </div>
              </div>
              <Divider className="border-gray-100" />
              <div className="mt-8 text-center">
                <Text className="text-[10px] text-gray-400 italic">Tính năng lọc đang được cập nhật...</Text>
              </div>
            </Card>
          </div>

          {/* Danh sách Khách sạn */}
          <div className="w-full lg:w-3/4">
            <div className="mb-12">
              <Title level={2} className="!m-0 !text-[#1a1a1a]" style={{ fontFamily: 'serif' }}>
                {query ? `Kết Quả Tại "${query}"` : 'Tất Cả Khách Sạn'}
              </Title>
              <div className="h-1 w-16 bg-[#c5a059] mt-3 mb-4 rounded-full"></div>
              <Text className="text-gray-400 font-light text-base italic">
                {hotels.length > 0 ? `Tìm thấy ${hotels.length} khách sạn đẳng cấp phù hợp với bạn` : 'Rất tiếc, chưa có kết quả phù hợp'}
              </Text>
            </div>

            {hotels.length > 0 ? (
              <Row gutter={[24, 32]}>
                {hotels.map((hotel: any) => (
                  <Col xs={24} md={12} xl={8} key={hotel.id}><HotelCard hotel={hotel} /></Col>
                ))}
              </Row>
            ) : (
              <Card className="text-center py-20 rounded-3xl border-dashed border-2 border-gray-200 bg-transparent">
                <Empty description={<Text className="text-gray-400">Không tìm thấy khách sạn nào.</Text>} />
                <Button onClick={() => window.location.href = '/hotels'} className="mt-4 border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059] hover:text-white transition-all">Xem tất cả khách sạn</Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export chính bọc trong Suspense
export default function HotelsPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#f9f7f2]"><Spin size="large" /></div>}>
      <HotelsContent />
    </Suspense>
  );
}