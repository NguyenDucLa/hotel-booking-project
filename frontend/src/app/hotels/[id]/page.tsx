"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { hotelService } from '@/services/hotelService';
import { Rate, Tag, Button, Spin, Empty, Row, Col, Card, Divider, Tooltip, Typography, Space, DatePicker } from 'antd';
import { 
  EnvironmentOutlined, WifiOutlined, CoffeeOutlined, 
  CarOutlined, MedicineBoxOutlined, ArrowLeftOutlined, 
  InfoCircleOutlined, CheckCircleFilled, CalendarOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function HotelDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State lưu ngày khách chọn để xem trạng thái phòng trống
  const [selectedDates, setSelectedDates] = useState<any>(null);

  // Hàm lấy dữ liệu (có truyền ngày nếu khách đã chọn)
  const fetchDetail = async (dates?: any) => {
    try {
      setLoading(true);
      let checkIn = "";
      let checkOut = "";
      
      if (dates && dates[0] && dates[1]) {
        checkIn = dates[0].format('YYYY-MM-DD');
        checkOut = dates[1].format('YYYY-MM-DD');
      }

      // Gọi API lấy chi tiết khách sạn kèm ngày để Backend check Xanh/Đỏ động
      const data = await hotelService.getHotelById(id as string, checkIn, checkOut);
      setHotel(data);
    } catch (error) {
      console.error("Lỗi lấy chi tiết khách sạn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const handleDateChange = (dates: any) => {
    setSelectedDates(dates);
    fetchDetail(dates); // Gọi lại API để cập nhật trạng thái phòng khi đổi ngày
  };

  const handleRoomClick = (room: any) => {
    if (room.status !== 'AVAILABLE') return;
    
    // Nếu chưa chọn ngày mà bấm vào phòng, nhắc khách chọn ngày trước
    if (!selectedDates) {
      return alert("Vui lòng chọn ngày nhận và trả phòng trước để đặt chỗ!");
    }

    // Chuyển sang trang booking kèm theo thông tin ngày đã chọn
    const checkIn = selectedDates[0].format('YYYY-MM-DD');
    const checkOut = selectedDates[1].format('YYYY-MM-DD');
    router.push(`/booking?hotelId=${hotel.id}&roomId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}`);
  };

  if (loading && !hotel) return <div className="h-screen flex items-center justify-center bg-[#f9f7f2]"><Spin size="large" description="Đang nạp không gian nghỉ dưỡng..." /></div>;
  if (!hotel) return <Empty description="Không tìm thấy khách sạn" />;

  return (
    <div className="min-h-screen bg-[#f9f7f2] pb-20">
      {/* 1. NÚT QUAY LẠI */}
      <div className="container mx-auto px-4 pt-6">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
          className="hover:text-[#c5a059] font-bold text-xs uppercase tracking-widest mb-4 flex items-center"
        >
          Quay lại danh sách
        </Button>
      </div>

      {/* 2. GALLERY ẢNH */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[500px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
          <div className="col-span-2 row-span-2 relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Main" />
          </div>
          <div className="col-span-1 row-span-1 relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gallery 1" />
          </div>
          <div className="col-span-1 row-span-1 relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gallery 2" />
          </div>
          <div className="col-span-1 row-span-1 relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gallery 3" />
          </div>
          <div className="col-span-1 row-span-1 bg-[#1a1a1a] flex items-center justify-center text-white">
            <div className="text-center">
              <span className="block text-2xl font-bold">+5</span>
              <span className="text-[10px] uppercase tracking-widest">Hình ảnh khác</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. THÔNG TIN CHÍNH */}
      <div className="container mx-auto px-4 mt-12">
        <Row gutter={[40, 40]}>
          <Col xs={24} lg={16}>
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Title level={1} className="!text-4xl !font-bold !text-[#1a1a1a] mb-2" style={{ fontFamily: 'serif' }}>{hotel.name}</Title>
                  <Text className="text-gray-400 flex items-center gap-2">
                    <EnvironmentOutlined className="text-[#c5a059]" /> {hotel.address}, {hotel.city}
                  </Text>
                </div>
                <div className="text-right">
                  <Rate disabled value={hotel.starRating} style={{ fontSize: 16 }} />
                  <Tag color="gold" className="ml-2 border-none font-bold uppercase text-[10px] py-1 px-3 mt-2 block shadow-sm">Luxury Choice</Tag>
                </div>
              </div>

              <Divider />

              {/* BỘ CHỌN NGÀY - PHẦN MỚI THÊM */}
              <div className="mb-10 bg-[#f9f7f2] p-6 rounded-2xl border border-[#c5a059]/20 shadow-inner">
                <Title level={4} className="!text-sm !font-bold mb-4 uppercase tracking-widest text-[#1a1a1a]">
                  <CalendarOutlined className="mr-2 text-[#c5a059]" /> Kiểm tra phòng trống theo ngày
                </Title>
                <DatePicker.RangePicker 
                  className="w-full h-14 rounded-xl border-[#c5a059]/30"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                  onChange={handleDateChange}
                  placeholder={['Ngày nhận phòng', 'Ngày trả phòng']}
                />
                {!selectedDates && <Text type="secondary" className="text-[11px] mt-2 block italic">* Chọn ngày để xem chính xác phòng nào còn trống.</Text>}
              </div>

              <div className="mb-10">
                <Title level={4} className="!text-sm !font-bold mb-4 uppercase tracking-widest text-[#c5a059]">Về khách sạn</Title>
                <Text className="text-gray-500 leading-relaxed font-light text-base block italic">
                  {hotel.description}
                </Text>
              </div>

              <div className="mb-10">
                <Title level={4} className="!text-sm !font-bold mb-6 uppercase tracking-widest text-[#c5a059]">Tiện nghi nổi bật</Title>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <Space><WifiOutlined className="text-[#c5a059]" /> <Text className="text-gray-600">Wifi Free</Text></Space>
                  <Space><CoffeeOutlined className="text-[#c5a059]" /> <Text className="text-gray-600">Breakfast</Text></Space>
                  <Space><CarOutlined className="text-[#c5a059]" /> <Text className="text-gray-600">Parking</Text></Space>
                  <Space><MedicineBoxOutlined className="text-[#c5a059]" /> <Text className="text-gray-600">Spa Service</Text></Space>
                </div>
              </div>

              <Divider />

              {/* 4. CHỌN PHÒNG */}
              <Title level={3} className="!text-xl !font-bold mb-8 uppercase tracking-widest text-[#1a1a1a]">Lựa chọn phòng của bạn</Title>
              
              <div className="space-y-10">
                {hotel.roomTypes?.map((type: any) => (
                  <div key={type.id} className="bg-[#fcfcfc] p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                      <div>
                        <h4 className="text-2xl font-bold text-[#1a1a1a] mb-1" style={{ fontFamily: 'serif' }}>{type.name}</h4>
                        <Text type="secondary" className="text-xs uppercase tracking-widest">Sức chứa tối đa: {type.capacity} khách • {type.bedType}</Text>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                        <Text className="text-[10px] text-gray-400 uppercase block font-bold">Giá niêm yết mỗi đêm</Text>
                        <Text className="text-2xl font-black text-[#c5a059]">
                          {new Intl.NumberFormat('vi-VN').format(type.basePrice)}đ
                        </Text>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-gray-200 pt-6">
                      <Text className="text-[10px] font-bold text-gray-400 uppercase mb-4 block tracking-widest">Sơ đồ phòng thực tế:</Text>
                      <div className="flex flex-wrap gap-4">
                        {type.rooms?.map((room: any) => (
                          // Trong phần map hiển thị các căn phòng (Room)
                          <Tooltip 
                            key={room.id} 
                            title={
                              !selectedDates 
                              ? "Vui lòng chọn ngày để kiểm tra" 
                              : room.status === 'AVAILABLE' ? "Phòng trống" : "Đã có khách đặt"
                            }
                          >
                            <div 
                              onClick={() => handleRoomClick(room)}
                              className={`
                                w-20 h-20 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-2
                                ${!selectedDates 
                                  ? 'bg-white border-gray-100 opacity-100 cursor-pointer' // Chưa chọn ngày thì hiện Xanh nhẹ (bình thường)
                                  : room.status === 'AVAILABLE' 
                                    ? 'bg-white border-[#c5a059] shadow-md cursor-pointer' // Trống trong lịch chọn
                                    : 'bg-red-50 border-red-100 cursor-not-allowed opacity-40' // Đã bận trong lịch chọn
                                }
                              `}
                            >
                              <Text strong className={room.status === 'AVAILABLE' || !selectedDates ? "text-[#1a1a1a]" : "text-red-300"}>
                                {room.roomNumber}
                              </Text>
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                !selectedDates ? 'bg-gray-300' : (room.status === 'AVAILABLE' ? 'bg-green-500' : 'bg-red-500')
                              }`}></div>
                            </div>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* SIDEBAR TÓM TẮT */}
          <Col xs={24} lg={8}>
            <div className="sticky top-28 space-y-6">
              <Card variant="borderless" className="bg-[#fd5c63] text-white rounded-3xl p-6 shadow-2xl border-none">
                <Title level={4} className="!text-white mb-8 flex items-center gap-3">
                  <CheckCircleFilled className="text-[#c5a059]" /> 
                  <span style={{ fontFamily: 'serif' }} className="uppercase tracking-widest text-base">Cam Kết Luxury</span>
                </Title>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 text-gray-400 text-sm">
                    <CheckCircleFilled className="text-[#c5a059] text-lg mt-1" />
                    <span>Giá tốt nhất khu vực {hotel.city}.</span>
                  </div>
                  <div className="flex items-start gap-4 text-gray-400 text-sm">
                    <CheckCircleFilled className="text-[#c5a059] text-lg mt-1" />
                    <span>Hỗ trợ hủy phòng linh hoạt trong 24h.</span>
                  </div>
                </div>
                <Divider className="bg-gray-800 my-8" />
                <div className="text-center bg-[#fd5c63] py-8 rounded-2xl border border-gray-800">
                  <Text className="text-gray-400 text-[10px] uppercase tracking-[0.3em] block mb-2 font-bold">Hotline đặt phòng</Text>
                  <Text className="text-[#c5a059] text-3xl font-black block tracking-tighter">0866.981.044</Text>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}