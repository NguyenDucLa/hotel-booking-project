"use client";
import React, { useEffect, useState } from 'react';
import { Input, Button, Spin, Row, Col, message } from 'antd';
import { SearchOutlined, EnvironmentOutlined, SafetyCertificateOutlined, DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { hotelService } from '@/services/hotelService';
import HotelCard from '@/components/HotelCard';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [featuredHotels, setFeaturedHotels] = useState<any[]>([]);
  const [cityCounts, setCityCounts] = useState<any>({});
  const [loading, setLoading] = useState(true);
  
  // LOGIC TÌM KIẾM
  const [searchKeyword, setSearchKeyword] = useState('');
  const router = useRouter();

  const destinations = [
    { name: 'TP. Hồ Chí Minh', img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800' },
    { name: 'Hà Nội', img: 'https://dntt.mediacdn.vn/197608888129458176/2022/9/21/ho-guom-du-lich-ha-noi-ivivu-16637590508811726461079.jpg' },
    { name: 'Đà Nẵng', img: 'https://cdn3.ivivu.com/2022/09/c%E1%BA%A7u-r%E1%BB%93ng-%C4%91%C3%A0-n%E1%BA%B5ng-ivivu-4.jpg' },
    { name: 'Đà Lạt', img: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=800' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelsData, countsData] = await Promise.all([
          hotelService.getFeaturedHotels(),
          hotelService.getCountByCity()
        ]);
        setFeaturedHotels(Array.isArray(hotelsData) ? hotelsData.slice(0, 4) : []);
        if (Array.isArray(countsData)) {
          const countsMap = countsData.reduce((acc: any, curr: any) => {
            if (curr && curr[0]) acc[curr[0]] = curr[1];
            return acc;
          }, {});
          setCityCounts(countsMap);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Hàm xử lý khi bấm nút TÌM KIẾM
  const handleSearch = () => {
    if (searchKeyword.trim()) {
      router.push(`/hotels?query=${encodeURIComponent(searchKeyword)}`);
    } else {
      router.push('/hotels'); // Nếu để trống thì hiện tất cả
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#f9f7f2]">
      <Spin size="large" />
      <p className="mt-4 text-[#c5a059] font-medium text-lg text-center">Đang tải trải nghiệm...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9f7f2]">
      {/* HERO SECTION */}
      <div className="relative h-[480px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920" className="w-full h-full object-cover" alt="Banner" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 w-full max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'serif' }}>Khám Phá Nơi Ở Lý Tưởng</h1>
          <p className="text-white/90 text-xl mb-10 font-light">Tận hưởng dịch vụ đẳng cấp tại những khách sạn hàng đầu Việt Nam</p>
          
          <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl flex items-center max-w-2xl mx-auto border border-white/20">
            <Input 
              prefix={<EnvironmentOutlined className="text-[#c5a059] mr-2" />}
              placeholder="Tìm kiếm khách sạn, thành phố..."
              variant="borderless"
              className="h-12 text-base font-medium"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onPressEnter={handleSearch}
            />
            <Button 
              onClick={handleSearch}
              className="!bg-[#1a1a1a] !text-white hover:!bg-[#c5a059] border-none h-12 px-10 font-bold rounded-xl ml-2 transition-all"
            >
              TÌM KIẾM
            </Button>
          </div>
        </div>
      </div>

      {/* ĐIỂM ĐẾN PHỔ BIẾN */}
      <div className="container mx-auto py-24 px-4">
        <h2 className="text-3xl font-bold text-center mb-16 text-[#1a1a1a]" style={{ fontFamily: 'serif' }}>Điểm Đến Phổ Biến</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {destinations.map((city) => (
            <div key={city.name} onClick={() => router.push(`/hotels?query=${city.name}`)} className="relative h-80 rounded-3xl overflow-hidden group cursor-pointer shadow-xl transition-all duration-500 hover:-translate-y-3">
              <img src={city.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={city.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-bold mb-2 uppercase tracking-wide">{city.name}</h3>
                <div className="bg-[#c5a059] text-white text-[10px] font-bold px-3 py-1 rounded-full inline-block uppercase">{cityCounts[city.name] || 0} KHÁCH SẠN</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KHÁCH SẠN NỔI BẬT */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: 'serif' }}>Khách Sạn Nổi Bật</h2>
            <div className="h-1 w-20 bg-[#c5a059] rounded-full"></div>
          </div>
          <Row gutter={[32, 32]}>
            {featuredHotels.map((hotel: any) => (
              <Col xs={24} sm={12} lg={6} key={hotel.id}><HotelCard hotel={hotel} /></Col>
            ))}
          </Row>
        </div>
      </div>

      {/* 4. TẠI SAO CHỌN CHÚNG TÔI */}
      <div className="container mx-auto py-24 px-4 border-t border-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-16 text-[#1a1a1a]" style={{ fontFamily: 'serif' }}>Tại Sao Nên Đặt Phòng Với Chúng Tôi?</h2>
        <Row gutter={[48, 48]}>
          <Col xs={24} md={8}>
            <SafetyCertificateOutlined className="text-5xl text-[#c5a059] mb-6" />
            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'serif' }}>Dịch Vụ Đẳng Cấp</h3>
            <p className="text-gray-500 text-sm">Tiêu chuẩn 5 sao khắt khe nhất để đảm bảo sự sang trọng.</p>
          </Col>
          <Col xs={24} md={8}>
            <DollarOutlined className="text-5xl text-[#c5a059] mb-6" />
            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'serif' }}>Giá Tốt Nhất</h3>
            <p className="text-gray-500 text-sm">Mức giá cạnh tranh nhất cùng nhiều ưu đãi thành viên.</p>
          </Col>
          <Col xs={24} md={8}>
            <ClockCircleOutlined className="text-5xl text-[#c5a059] mb-6" />
            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'serif' }}>Hỗ Trợ 24/7</h3>
            <p className="text-gray-500 text-sm">Đội ngũ tận tâm luôn sẵn sàng giải đáp mọi thắc mắc.</p>
          </Col>
        </Row>
      </div>
    </div>
  );
}