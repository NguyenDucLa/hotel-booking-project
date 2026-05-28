"use client";
import React, { useState } from 'react';
import { Card, Rate, Button } from 'antd';
import { ShopOutlined, ArrowRightOutlined, HeartOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export default function HotelCard({ hotel }: { hotel: any }) {
  const router = useRouter();

  // Danh sách link ảnh Unsplash chất lượng cao và ổn định
  const hotelImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=800"
  ];

  // Chọn ảnh dựa trên hotel.id, nếu ID lớn hơn mảng thì dùng phép chia lấy dư
  const [imgSrc, setImgSrc] = useState(hotelImages[hotel.id % hotelImages.length]);

  // Hàm xử lý khi link ảnh bị lỗi (Fallback)
  const handleImageError = () => {
    // Nếu ảnh bị lỗi, đổi sang tấm ảnh số 0 trong danh sách (thường là tấm đẹp nhất/ổn định nhất)
    setImgSrc(hotelImages[0]);
  };

  return (
    <Card
      hoverable
      className="border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white flex flex-col h-full group"
      cover={
        <div className="relative overflow-hidden h-56 bg-gray-100">
          <img
            alt={hotel.name}
            src={imgSrc}
            onError={handleImageError} // Tự động đổi ảnh nếu link chết
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {hotel.starRating >= 5 && (
            <div className="absolute top-4 left-0 bg-[#c5a059] text-white text-[10px] font-bold px-3 py-1 rounded-r-lg uppercase shadow-lg">
              LUXURY
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-red-500 hover:text-white transition-all shadow-md">
            <HeartOutlined />
          </div>
        </div>
      }
    >
      <div className="flex flex-col flex-grow justify-between">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-[#1a1a1a] mb-1 line-clamp-1 group-hover:text-[#c5a059] transition-colors" style={{ fontFamily: 'serif' }}>
            {hotel.name}
          </h3>
          <div className="flex items-center text-gray-500 text-[11px] gap-1 mb-2">
            <ShopOutlined className="text-[#c5a059]" />
            <span className="truncate">{hotel.city}</span>
          </div>
          <Rate disabled value={hotel.starRating > 5 ? 5 : hotel.starRating} count={5} style={{ fontSize: 10 }} />
        </div>
        
        <Button 
          type="primary" 
          block
          onClick={() => router.push(`/hotels/${hotel.id}`)}
          className="!bg-[#1a1a1a] hover:!bg-[#c5a059] !text-white border-none rounded-xl h-10 font-bold flex items-center justify-center gap-2 transition-all"
        >
          Khám phá <ArrowRightOutlined />
        </Button>
      </div>
    </Card>
  );
}